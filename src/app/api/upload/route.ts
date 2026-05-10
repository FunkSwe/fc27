import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { hasCloudinaryConfig } from '@/lib/cloudinary';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

function bufferToDataUri(file: File, buffer: Buffer) {
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured on the server.' },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Image is too large. Max size is 5MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await cloudinary.uploader.upload(bufferToDataUri(file, buffer), {
      folder: process.env.CLOUDINARY_FOLDER || 'funkcamp',
      resource_type: 'image',
      transformation: [
        {
          width: 1600,
          height: 1600,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });

    return NextResponse.json({
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
  }
}

'use client';

import { useEffect, useRef } from 'react';
import { initFunkcampStory } from './storyAnimation';
import styles from './FunkcampStory.module.scss';

export default function FunkcampStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) return initFunkcampStory(rootRef.current);
  }, []);

  return (
    <div
      id="fc-story-funkcamp-story"
      className={`${styles.story} motion-off`}
      ref={rootRef}
    >
      <section
        id="fc-story-start"
        className="scene hero-scene"
        data-scene="hero"
        aria-labelledby="fc-story-title"
      >
        <div className="stage hero-stage">
          <div className="hero-meta">
            <span>01 / THE DEPARTURE</span>
            <span>A JOURNEY TO THE FUNK.</span>
          </div>

          <h1 id="fc-story-title">
            <span className="hero-kicker">Funkcamp 2027</span>
            <span>IT STARTS</span>
            <span>WITH ONE</span>
            <span className="first-step">STEP.</span>
          </h1>
          <div className="hero-bottom">
            <div>
              <p className="date">26—29 MARCH</p>
              <p className="small">STOCKHOLM, SWEDEN / LOCKING CAMP</p>
            </div>
            <a className="outline-button" href="#fc-story-resan">
              Follow the funk <span>↓</span>
            </a>
          </div>
          <div className="door-world" aria-hidden="true">
            <div className="door-opening">
              <span>
                STHLM
                <br />
                27
              </span>
            </div>
          </div>
          <div className="home-path" aria-hidden="true">
            <div className="walker hero-walker"></div>
          </div>
          <div className="door-front" aria-hidden="true">
            <div className="door-leaf"></div>
            <span className="door-jamb"></span>
          </div>
          <p className="hero-scroll-note">
            EVERY JOURNEY STARTS WITH A STEP. <span>SCROLL TO BEGIN ↓</span>
          </p>
        </div>
      </section>
      <section
        id="fc-story-resan"
        className="scene airport-scene"
        data-scene="airport"
        aria-labelledby="fc-story-airport-title"
      >
        <div className="stage airport-stage">
          <div className="scene-top">
            <span>02 / THE ARRIVAL</span>
            <span>ARN → STHLM</span>
          </div>
          <div className="airport-backdrop art" aria-hidden="true"></div>
          <div className="airport-foreground" aria-hidden="true"></div>
          <div className="airport-type" aria-hidden="true">
            HELLO,
            <br />
            STOCKHOLM.
          </div>
          <img
            className="airplane"
            src="/images/funkcamp-story/plane.png"
            alt=""
            aria-hidden="true"
          />
          <div className="flight-ticks" aria-hidden="true">
            <span>01</span>
            <span>02</span>
            <span>03</span>
            <span>04</span>
          </div>
          <div className="copy airport-copy">
            <p className="eyebrow">NEXT STOP: THE FUNK</p>
            <h2 id="fc-story-airport-title">
              You’ve
              <br />
              landed.
            </h2>
            <p>A little closer to the dance floor.</p>
          </div>
          <div className="scene-bottom">
            <span>ARLANDA, SWEDEN</span>
            <span>KEEP GOING ↓</span>
          </div>
        </div>
      </section>
      <section
        id="fc-story-terminalen"
        className="scene terminal-scene"
        data-scene="terminal"
        aria-labelledby="fc-story-terminal-title"
      >
        <div className="stage terminal-stage">
          <div className="terminal-panorama" aria-hidden="true"></div>
          <div className="terminal-tone" aria-hidden="true"></div>
          <div className="scene-top">
            <span>03 / THROUGH THE TERMINAL</span>
            <span>ARN → STOCKHOLM</span>
          </div>
          <div className="terminal-sign" aria-hidden="true">
            <span>STOCKHOLM CITY</span>
            <b>→</b>
          </div>
          <div className="terminal-glass" aria-hidden="true"></div>
          <div className="walker terminal-walker" aria-hidden="true"></div>
          <div className="copy terminal-copy">
            <p className="eyebrow">ONE STEP CLOSER</p>
            <h2 id="fc-story-terminal-title">
              Follow
              <br />
              the funk.
            </h2>
          </div>
          <div className="scene-bottom">
            <span>THROUGH THE AIRPORT. INTO THE CITY.</span>
            <span>STOCKHOLM IS NEXT ↓</span>
          </div>
        </div>
      </section>
      <section
        id="fc-story-stockholm"
        className="scene city-scene"
        data-scene="city"
        aria-labelledby="fc-story-city-title"
      >
        <div className="stage city-stage">
          <div className="scene-top">
            <span>04 / THE CITY</span>
            <span>59°19′ N · 18°04′ E</span>
          </div>
          <div className="city-sun" aria-hidden="true"></div>
          <div className="city-title">
            <p className="eyebrow">WELCOME TO</p>
            <h2 id="fc-story-city-title">
              STOCK<span>HOLM.</span>
            </h2>
          </div>
          <div className="city-layer city-far" aria-hidden="true"></div>
          <div className="city-layer city-mid" aria-hidden="true"></div>
          <div className="city-layer city-near" aria-hidden="true"></div>
          <div className="water" aria-hidden="true"></div>
          <div className="city-caption">
            <span className="cross" aria-hidden="true">
              ✳
            </span>
            <p>
              One city.
              <br />
              All roads lead to the same floor.
            </p>
          </div>
          <div className="scene-bottom">
            <span>THE CITY WAKES UP. YOU’RE ON YOUR WAY.</span>
            <span>KEEP GOING ↓</span>
          </div>
        </div>
      </section>
      <section
        id="fc-story-pa-vag"
        className="scene walk-scene"
        data-scene="walk"
        aria-labelledby="fc-story-walk-title"
      >
        <div className="stage walk-stage">
          <div className="scene-top">
            <span>05 / AT THE DOOR</span>
            <span>BRING YOUR OWN STYLE.</span>
          </div>
          <div className="walk-panorama" aria-hidden="true">
            <div className="venue-image"></div>
            <div className="venue-red"></div>
          </div>
          <div className="walk-ground" aria-hidden="true"></div>
          <div className="walker traveler" aria-hidden="true"></div>
          <div className="copy walk-copy">
            <p className="eyebrow">FROM YOUR WORLD TO OUR FLOOR</p>
            <h2 id="fc-story-walk-title">
              A few
              <br />
              steps away.
            </h2>
          </div>
          <div className="scene-bottom">
            <span>COME CLOSER. FIND YOUR WAY IN.</span>
            <span>STEP INSIDE ↓</span>
          </div>
        </div>
      </section>
      <section
        id="fc-story-golvet"
        className="scene studio-scene"
        data-scene="studio"
        aria-labelledby="fc-story-studio-title"
      >
        <div className="stage studio-stage">
          <div
            className="studio-art"
            role="img"
            aria-label="An illustrated locking workshop, with the teacher and participants in up-lock poses."
          ></div>
          <div className="studio-shade" aria-hidden="true"></div>
          <div className="scene-top">
            <span>06 / ON THE FLOOR</span>
            <span>LOCKING. FUNK. CHARACTER.</span>
          </div>
          <figure className="class-photo-frame">
            <img
              src="/images/funkcamp-story/class-feature-ink.png"
              alt="A screenprint illustration of a locking teacher pointing, with students holding up-lock poses."
              width="410"
              height="367"
            />
            <figcaption>LOCKING / IN MOTION</figcaption>
          </figure>
          <div className="studio-copy">
            <p className="eyebrow">THIS IS WHERE IT BEGINS</p>
            <h2 id="fc-story-studio-title">
              FIND
              <br />
              YOUR
              <br />
              <em>FUNK.</em>
            </h2>
            <p>
              Locks. Points. Groove.
              <br />
              Your personality. One shared floor.
            </p>
          </div>
          <span className="studio-stamp" aria-hidden="true">
            LOCKING
            <br />
            CAMP
            <br />
            2027
          </span>
          <div className="scene-bottom">
            <span>26–29 MARCH / STOCKHOLM</span>
            <span>MEET THE TEACHERS ↓</span>
          </div>
        </div>
      </section>
      <section
        id="fc-story-lararna"
        className="scene teachers-scene"
        data-scene="teachers"
        aria-labelledby="fc-story-teachers-title"
      >
        <div className="stage teachers-stage">
          <div className="scene-top">
            <span>07 / THE PEOPLE</span>
            <span>LOCKING · LINE-UP</span>
          </div>
          <h2 id="fc-story-teachers-title" className="teachers-heading">
            MEET THE TEACHERS.
          </h2>
          <div className="teacher-backword" aria-hidden="true">
            LOCKING
          </div>
          <span className="teacher-index" aria-hidden="true">
            01
          </span>
          <div className="teacher-ink-progress" aria-hidden="true">
            <span></span>
          </div>
          <div className="teacher-stage">
            <article className="teacher active" data-teacher="0">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t6.png"
                alt="Tony GoGo"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">01 / USA · JAPAN</span>
                <h3>
                  TONY
                  <br />
                  GOGO
                </h3>
                <a href="/teachers/tony-gogo">Meet Tony GoGo ↗</a>
              </div>
            </article>
            <article className="teacher" data-teacher="1">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t1.png"
                alt="Khan"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">02 / KOREA</span>
                <h3>KHAN</h3>
                <a href="/teachers/khan">Meet Khan ↗</a>
              </div>
            </article>
            <article className="teacher" data-teacher="2">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t2.png"
                alt="P-Lock"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">03 / FRANCE</span>
                <h3>P-LOCK</h3>
                <a href="/teachers/p-lock">Meet P-Lock ↗</a>
              </div>
            </article>
            <article className="teacher" data-teacher="3">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t4.png"
                alt="Funky Asparagus"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">04 / SWEDEN</span>
                <h3>
                  FUNKY
                  <br />
                  ASPARAGUS
                </h3>
                <a href="/teachers/funky-asparagus">Meet Funky Asparagus ↗</a>
              </div>
            </article>
            <article className="teacher" data-teacher="4">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t5.png"
                alt="Willow"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">05 / FRANCE</span>
                <h3>WILLOW</h3>
                <a href="/teachers/willow">Meet Willow ↗</a>
              </div>
            </article>
            <article className="teacher" data-teacher="5">
              <div className="teacher-disc" aria-hidden="true"></div>
              <svg
                className="teacher-scribble"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    pathLength="1"
                    d="M500 105q57 39 21 106l-2-33m2 33 28-17"
                  />
                  <path
                    pathLength="1"
                    d="m77 165 13 25 28-4-19 23 11 27-27-12-21 18 3-28-25-15 29-5Z"
                  />
                  <path
                    pathLength="1"
                    d="M92 437q32 19 76 1M95 448q39 15 73-2M438 474l22-13m-12 30 24-8"
                  />
                </g>
              </svg>
              <img
                src="/images/funkcamp-story/t3.png"
                alt="A-Train"
                width="500"
                height="650"
                loading="lazy"
              />
              <div className="teacher-copy">
                <span className="eyebrow">06 / SWEDEN</span>
                <h3>A-TRAIN</h3>
                <a href="/teachers/a-train">Meet A-Train ↗</a>
              </div>
            </article>
          </div>
          <div className="teacher-controls">
            <button
              type="button"
              id="fc-story-prev-teacher"
              aria-label="Previous teacher"
            >
              ←
            </button>
            <span id="fc-story-teacher-count" aria-live="polite">
              01 / 06
            </span>
            <button
              type="button"
              id="fc-story-next-teacher"
              aria-label="Next teacher"
            >
              →
            </button>
          </div>
          <a className="lineup-shortcut" href="#fc-story-samlad-lineup">
            See the full line-up ↘
          </a>
          <div className="teacher-names" aria-label="Choose a teacher">
            <button type="button" data-pick="0" className="active">
              Tony GoGo
            </button>
            <button type="button" data-pick="1">
              Khan
            </button>
            <button type="button" data-pick="2">
              P-Lock
            </button>
            <button type="button" data-pick="3">
              Funky Asparagus
            </button>
            <button type="button" data-pick="4">
              Willow
            </button>
            <button type="button" data-pick="5">
              A-Train
            </button>
          </div>
        </div>
      </section>
      <section
        id="fc-story-finalen"
        className="scene finale-scene"
        data-scene="finale"
        aria-labelledby="fc-story-finale-title"
      >
        <span
          id="fc-story-samlad-lineup"
          className="finale-beat"
          aria-hidden="true"
        ></span>
        <div className="stage finale-stage">
          <div className="scene-top">
            <span>ALL ROADS LEAD HERE.</span>
            <span>LOCKING CAMP / STOCKHOLM</span>
          </div>
          <div className="final-lineup" aria-label="The Funkcamp 2027 teachers">
            <figure>
              <img src="/images/funkcamp-story/t6.png" alt="Tony GoGo" />
              <figcaption>Tony GoGo</figcaption>
            </figure>
            <figure>
              <img src="/images/funkcamp-story/t1.png" alt="Khan" />
              <figcaption>Khan</figcaption>
            </figure>
            <figure>
              <img src="/images/funkcamp-story/t2.png" alt="P-Lock" />
              <figcaption>P-Lock</figcaption>
            </figure>
            <figure>
              <img src="/images/funkcamp-story/t4.png" alt="Funky Asparagus" />
              <figcaption>Funky Asparagus</figcaption>
            </figure>
            <figure>
              <img src="/images/funkcamp-story/t5.png" alt="Willow" />
              <figcaption>Willow</figcaption>
            </figure>
            <figure>
              <img src="/images/funkcamp-story/t3.png" alt="A-Train" />
              <figcaption>A-Train</figcaption>
            </figure>
          </div>
          <div className="final-title-zone">
            <h2 id="fc-story-finale-title">
              <span className="final-funk">FUNKCAMP</span>
              <span className="final-year">2027</span>
            </h2>
          </div>
          <div className="final-date">
            <span>26—29 MARCH</span>
            <span>STOCKHOLM, SWEDEN</span>
          </div>
          <div className="scene-bottom">
            <span>YOUR GROOVE. YOUR CHARACTER. OUR FLOOR.</span>
            <a href="/registration#waiting-list">COME WITH US ↓</a>
          </div>
        </div>
      </section>
    </div>
  );
}

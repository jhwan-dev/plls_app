import type { CSSProperties, ReactNode } from "react";
import type { PosterData, TemplateId } from "@/lib/story-poster-data";

const CONDENSED = "'Arial Narrow', Arial, sans-serif";
const SERIF_ITALIC = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', Courier, monospace";
const SANS = "var(--font-geist-sans), Arial, sans-serif";

interface TemplateProps {
  data: PosterData;
}

function Bg({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
    <img
      src={src}
      alt=""
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function Cover({ coverImageUrl, style }: { coverImageUrl: string | null; style: CSSProperties }) {
  if (coverImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
      <img src={coverImageUrl} crossOrigin="anonymous" alt="" style={{ ...style, objectFit: "cover" }} />
    );
  }
  return (
    <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image */}
      <img src="/brand/p-symbol.png" alt="" style={{ height: "42%", width: "auto" }} />
    </div>
  );
}

function TrackList({
  data,
  style,
  numberColor,
  textColor,
  subColor,
  fontSize = 27,
  count = 5,
}: {
  data: PosterData;
  style: CSSProperties;
  numberColor: string;
  textColor: string;
  subColor: string;
  fontSize?: number;
  count?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, ...style }}>
      {data.trackLines.slice(0, count).map((track, index) => (
        <div key={index} style={{ display: "flex", gap: 14, alignItems: "baseline", minWidth: 0 }}>
          <span style={{ color: numberColor, fontFamily: MONO, fontWeight: 700, fontSize, width: 34, flexShrink: 0 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              color: textColor,
              fontSize,
              fontWeight: 600,
              fontFamily: SANS,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {track.title} <span style={{ color: subColor, fontWeight: 400 }}>— {track.artist}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Big display title, shared by every template — always single-line with a
 * clipping ellipsis rather than wrapping, so an unexpectedly long playlist
 * title truncates cleanly instead of overflowing into whatever sits below
 * it (this bit several templates when wrapping was allowed). */
function Title({ text, style }: { text: string; style: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: CONDENSED,
        fontWeight: 900,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** Body copy shared by most templates: tracklist for the text-dense
 * templates, the playlist description otherwise (with a plain fallback line
 * when there's no description at all). */
function BodyContent({
  data,
  isTracklist,
  style,
  numberColor,
  textColor,
  subColor,
  fontFamily = SANS,
  fontStyle,
  fontSize = 32,
}: {
  data: PosterData;
  isTracklist: boolean;
  style: CSSProperties;
  numberColor: string;
  textColor: string;
  subColor: string;
  fontFamily?: string;
  fontStyle?: CSSProperties["fontStyle"];
  fontSize?: number;
}) {
  if (isTracklist) {
    return <TrackList data={data} style={style} numberColor={numberColor} textColor={textColor} subColor={subColor} />;
  }
  return (
    <div style={{ fontFamily, fontStyle, fontSize, color: textColor, lineHeight: 1.35, ...style }}>
      {data.description || `${data.trackCount}곡을 모은 플레이리스트.`}
    </div>
  );
}

const CONTAINER: CSSProperties = {
  position: "relative",
  width: 1080,
  height: 1920,
  overflow: "hidden",
  textAlign: "left",
};

function Wrap({ children }: { children: ReactNode }) {
  return <div style={CONTAINER}>{children}</div>;
}

// ---------------------------------------------------------------------------
// T02 — blue field, green "vinyl" circle. No cover slot. Description sits
// inside the circle as an italic tagline.
function T02({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t02.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 210, width: 960, fontSize: 108, lineHeight: 0.95, color: "#EDE0C8" }}
      />
      <div style={{ position: "absolute", left: 60, top: 780, width: 620 }}>
        <BodyContent
          data={data}
          isTracklist={false}
          style={{}}
          numberColor="#1a2e1a"
          textColor="#16321c"
          subColor="rgba(22,50,28,0.6)"
          fontFamily={SERIF_ITALIC}
          fontStyle="italic"
          fontSize={44}
        />
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 150, fontFamily: MONO, fontSize: 22, color: "#0f1a3a", lineHeight: 1.8 }}>
        <div>{data.trackCount} TRACKS · {data.durationLabel}</div>
        <div>SELECTED BY {data.curatorHandle}</div>
        <div>PLLS.APP</div>
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T03 — beige, pink tape. Cover slot bottom-left, description beside it,
// "TWO STEP · SPEED · DUB PLATE" stays fixed decorative text.
function T03({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t03.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 230, width: 960, fontSize: 118, lineHeight: 0.92, color: "#111111" }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 700,
          fontFamily: CONDENSED,
          fontWeight: 900,
          fontSize: 46,
          color: "#E8368F",
          letterSpacing: 1,
        }}
      >
        TWO STEP · SPEED · DUB PLATE
      </div>
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 60, top: 1290, width: 320, height: 320 }}
      />
      <div style={{ position: "absolute", left: 420, top: 1300, width: 560, fontFamily: SANS, fontSize: 28, color: "#222", lineHeight: 1.4 }}>
        {data.description || `${data.trackCount}곡, ${data.durationLabel}.`}
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 110, fontFamily: MONO, fontSize: 24, color: "#333" }}>
        {data.curatorHandle} · {data.durationLabel}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T04 — dark purple, yellow band word grid. Only "UK GARAGE" (title) is
// dynamic; SHUFFLED/DRUMS, PITCHED/VOCALS, SUB LAST/BASS TRAIN stay fixed.
function T04({ data }: TemplateProps) {
  // Two stacked lines, splitting the title on its first space so a
  // two-word title (like the mockup's "UK GARAGE") reproduces the
  // original grid exactly; anything else still reads fine as line 1 +
  // remainder, each independently clipped so neither line can push into
  // the yellow band below.
  const spaceIndex = data.title.indexOf(" ");
  const first = spaceIndex === -1 ? data.title : data.title.slice(0, spaceIndex);
  const second = spaceIndex === -1 ? "" : data.title.slice(spaceIndex + 1);
  return (
    <Wrap>
      <Bg src="/story-templates/t04.png" />
      <div style={{ position: "absolute", left: 44, top: 545, width: 992 }}>
        <Title text={first} style={{ fontSize: 92, lineHeight: 1.05, color: "#FF4FA3" }} />
        {second && <Title text={second} style={{ fontSize: 92, lineHeight: 1.05, color: "#FF4FA3" }} />}
      </div>
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 44, top: 1207, width: 210, height: 200 }}
      />
      <div style={{ position: "absolute", left: 44, bottom: 130, fontFamily: MONO, fontSize: 22, color: "#F2EFE6", lineHeight: 1.7 }}>
        <div>{data.trackCount} TRACKS / {data.durationLabel}</div>
        <div>{data.curatorHandle} · {data.dateLabel}</div>
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T05 — classifieds. Tracklist mode (dense). Classified-ad columns stay
// fixed; only title, tracklist, cover swatch and meta are dynamic.
function T05({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t05.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 500, width: 960, fontSize: 108, lineHeight: 0.95, color: "#FF5A1F" }}
      />
      <BodyContent
        data={data}
        isTracklist
        style={{ position: "absolute", left: 60, top: 830, width: 700 }}
        numberColor="#FF5A1F"
        textColor="#111111"
        subColor="rgba(17,17,17,0.55)"
        fontSize={26}
      />
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 810, top: 830, width: 210, height: 210 }}
      />
      <div style={{ position: "absolute", left: 60, bottom: 90, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        {data.curatorHandle} · {data.durationLabel} · SAVED BY {data.likeCount}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T06 — orange stripe ticket. Cover in the ticket body, description beside
// it, stub section below gets real metadata.
function T06({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t06.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 88, top: 260, width: 900, fontSize: 100, lineHeight: 0.95, color: "#F3ECDD" }}
      />
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 86, top: 928, width: 262, height: 262 }}
      />
      <div style={{ position: "absolute", left: 388, top: 940, width: 610, fontFamily: SANS, fontSize: 27, color: "#f0f0f0", lineHeight: 1.4 }}>
        {data.description || `${data.trackCount}곡, ${data.durationLabel}.`}
      </div>
      <div style={{ position: "absolute", left: 86, top: 1355, fontFamily: CONDENSED, fontWeight: 900, fontSize: 26, color: "#111" }}>
        {data.trackCount} TRACKS / {data.durationLabel}
      </div>
      <div style={{ position: "absolute", left: 86, top: 1395, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        SELECTED BY {data.curatorHandle}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T07 — tan, rotated title, cassette. Cover swatch, italic tagline.
function T07({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t07.png" />
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 940,
          transform: "rotate(-90deg)",
          transformOrigin: "left top",
          fontFamily: CONDENSED,
          fontWeight: 900,
          fontSize: 100,
          color: "#151515",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {data.title}
      </div>
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 704, top: 1030, width: 290, height: 290 }}
      />
      <div style={{ position: "absolute", left: 660, top: 1400, width: 340 }}>
        <BodyContent
          data={data}
          isTracklist={false}
          style={{}}
          numberColor="#151515"
          textColor="#151515"
          subColor="rgba(21,21,21,0.6)"
          fontFamily={SERIF_ITALIC}
          fontStyle="italic"
          fontSize={34}
        />
      </div>
      <div style={{ position: "absolute", left: 660, top: 1620, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        {data.durationLabel} · TAP TO PLAY
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 90, fontFamily: MONO, fontSize: 22, color: "#333", lineHeight: 1.6 }}>
        <div>{data.curatorHandle}</div>
        <div>{data.dateLabel}</div>
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T08 — terminal aesthetic. No cover. Tracklist mode, in monospace, plus a
// stat readout with real metadata.
function T08({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t08.png" />
      <div style={{ position: "absolute", left: 60, top: 300, fontFamily: MONO, fontSize: 24, color: "#F5A623" }}>
        {'> LOAD "'}{data.title.toUpperCase().replace(/\s+/g, "_")}{'.MIX"'}
      </div>
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 340, width: 960, fontSize: 108, lineHeight: 0.95, color: "#F5A623" }}
      />
      <TrackList
        data={data}
        style={{ position: "absolute", left: 60, top: 1000, width: 960 }}
        numberColor="#3DDC97"
        textColor="#EDEDED"
        subColor="rgba(237,237,237,0.55)"
        fontSize={26}
        count={5}
      />
      <div style={{ position: "absolute", left: 60, bottom: 200, fontFamily: MONO, fontSize: 22, color: "#3DDC97", lineHeight: 1.9 }}>
        <div>TRACKS ......... {data.trackCount}</div>
        <div>RUNTIME ........ {data.durationLabel}</div>
        <div>BY ............. {data.curatorHandle}</div>
        <div>SAVED .......... {data.likeCount}</div>
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T09 — dark blueprint/graph paper. Tracklist mode replaces the technical
// drawing's material row area; small swatch stays as decorative texture
// (no cover — see NO_COVER? no, T09 has a cover per confirmed mapping).
function T09({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t09.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 300, width: 700, fontSize: 100, lineHeight: 0.95, color: "#EDE0C8" }}
      />
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 822, top: 838, width: 198, height: 198 }}
      />
      <TrackList
        data={data}
        style={{ position: "absolute", left: 60, top: 1250, width: 700 }}
        numberColor="#D98A2B"
        textColor="#EDE0C8"
        subColor="rgba(237,224,200,0.55)"
        fontSize={26}
        count={4}
      />
      <div style={{ position: "absolute", left: 60, bottom: 90, fontFamily: MONO, fontSize: 20, color: "#9fb59f" }}>
        DRAWN BY {data.curatorHandle} · {data.dateLabel} · {data.durationLabel}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T10 — red field, tilted title. No cover. Italic tagline (description).
function T10({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t10.png" />
      <Title
        text={data.title}
        style={{
          position: "absolute",
          left: -20,
          top: 40,
          width: 1000,
          transform: "rotate(-8deg)",
          transformOrigin: "left top",
          fontSize: 110,
          lineHeight: 0.92,
          color: "#F3ECDD",
        }}
      />
      <div style={{ position: "absolute", left: 140, top: 960, width: 800, transform: "rotate(-8deg)", transformOrigin: "left top" }}>
        <BodyContent
          data={data}
          isTracklist={false}
          style={{}}
          numberColor="#F3ECDD"
          textColor="#111111"
          subColor="rgba(17,17,17,0.6)"
          fontFamily={CONDENSED}
          fontSize={38}
        />
        <div style={{ fontFamily: MONO, fontSize: 22, color: "#1a1a1a", marginTop: 24 }}>
          {data.trackCount} TRACKS / {data.durationLabel}
          <br />
          COMPILED BY {data.curatorHandle}
          <br />
          {data.dateLabel}
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 90, fontFamily: MONO, fontSize: 22, color: "#F3ECDD" }}>
        SAVED BY {data.likeCount}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T11 — dark editorial, wide cropped cover. Tracklist mode across the two
// body columns.
function T11({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t11.png" />
      <div style={{ position: "absolute", left: 60, top: 175, fontFamily: MONO, fontSize: 22, color: "#EDEDED", lineHeight: 1.7, textAlign: "right", width: 970 }}>
        <div>Compiled by {data.curatorHandle}</div>
        <div>Length {data.trackCount} tracks, {data.durationLabel}</div>
      </div>
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 60, top: 390, width: 960, height: 480 }}
      />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 44, top: 940, width: 992, fontSize: 108, lineHeight: 0.95, color: "#F3ECDD" }}
      />
      <TrackList
        data={data}
        style={{ position: "absolute", left: 60, top: 1620, width: 960 }}
        numberColor="#F3ECDD"
        textColor="#EDEDED"
        subColor="rgba(237,237,237,0.55)"
        fontSize={24}
        count={3}
      />
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T12 — cream, starburst cover accent (kept as decoration, no photo swap —
// see NO_COVER note below). Title split across two lines with mood words
// fixed; small caption + track/curator meta stays dynamic.
function T12({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t12.png" />
      <Title
        text={data.title}
        style={{ position: "absolute", left: 44, top: 200, width: 900, fontSize: 92, lineHeight: 1.05, color: "#111111" }}
      />
      <div style={{ position: "absolute", right: 60, top: 250, fontFamily: MONO, fontSize: 24, color: "#111" }}>
        {data.trackCount} TRK
      </div>
      <div style={{ position: "absolute", left: 44, top: 1200, fontFamily: MONO, fontSize: 20, color: "#333", lineHeight: 1.6 }}>
        <div>COVER ART</div>
        <div>{data.curatorHandle}</div>
      </div>
      <div style={{ position: "absolute", left: 44, bottom: 90, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        {data.durationLabel} · {data.dateLabel}
      </div>
    </Wrap>
  );
}

// ---------------------------------------------------------------------------
// T13 — warm grey "mixtape pages". Tracklist mode across the two body
// columns; cover swatch (duotone-labelled originally) becomes the real
// cover, stat row gets real numbers.
function T13({ data }: TemplateProps) {
  return (
    <Wrap>
      <Bg src="/story-templates/t13.png" />
      <div style={{ position: "absolute", left: 60, top: 230, fontFamily: MONO, fontSize: 22, color: "#555" }}>
        NO. — · {data.dateLabel}
      </div>
      <Title
        text={data.title}
        style={{ position: "absolute", left: 60, top: 280, width: 620, fontSize: 100, lineHeight: 0.95, color: "#FF4A2B" }}
      />
      <Cover
        coverImageUrl={data.coverImageUrl}
        style={{ position: "absolute", left: 720, top: 655, width: 300, height: 300 }}
      />
      <div style={{ position: "absolute", left: 60, top: 1000, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        TRACKS {data.trackCount} · RUNTIME {data.durationLabel} · SAVED {data.likeCount}
      </div>
      <TrackList
        data={data}
        style={{ position: "absolute", left: 60, top: 1080, width: 960 }}
        numberColor="#FF4A2B"
        textColor="#111111"
        subColor="rgba(17,17,17,0.55)"
        fontSize={26}
        count={5}
      />
      <div style={{ position: "absolute", left: 60, bottom: 90, fontFamily: MONO, fontSize: 22, color: "#333" }}>
        {data.curatorHandle}
      </div>
    </Wrap>
  );
}

export const POSTER_TEMPLATES: Record<TemplateId, (props: TemplateProps) => ReactNode> = {
  t02: T02,
  t03: T03,
  t04: T04,
  t05: T05,
  t06: T06,
  t07: T07,
  t08: T08,
  t09: T09,
  t10: T10,
  t11: T11,
  t12: T12,
  t13: T13,
};

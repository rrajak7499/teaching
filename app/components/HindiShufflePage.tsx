"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";

// ---------- Hindi Data ----------
const swar = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ऋ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "अं",
  "अः",
];
const vyanjan = [
  "क",
  "ख",
  "ग",
  "घ",
  "ङ",
  "च",
  "छ",
  "ज",
  "झ",
  "ञ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
  "क्ष",
  "त्र",
  "ज्ञ",
];
const matras = [
  "ा",
  "ि",
  "ी",
  "ु",
  "ू",
  "ृ",
  "े",
  "ै",
  "ो",
  "ौ",
  "ँ",
  "ं",
  "ः",
  "्",
];

const generateCombinations = () => {
  const combos: string[] = [];
  vyanjan.forEach((c) => matras.forEach((m) => combos.push(c + m)));
  return combos;
};

// ---------- Constants ----------
const ITEM_SIZE = 72;
const COLLISION_PADDING = 8;
const ACTIVITY_HEIGHT = 640;

// ---------- Helpers ----------
const hasCollision = (
  a: { left: number; top: number },
  b: { left: number; top: number }
) =>
  a.left < b.left + ITEM_SIZE + COLLISION_PADDING &&
  a.left + ITEM_SIZE + COLLISION_PADDING > b.left &&
  a.top < b.top + ITEM_SIZE + COLLISION_PADDING &&
  a.top + ITEM_SIZE + COLLISION_PADDING > b.top;

// ---------- Components ----------
const OriginalTextReference = ({
  listType,
  start,
  end,
}: {
  listType: string;
  start: number;
  end: number;
}) => {
  let currentData: string[] = [];
  let title = "";

  switch (listType) {
    case "swar":
      currentData = swar;
      title = "स्वर (Vowels)";
      break;
    case "vyanjan":
      currentData = vyanjan;
      title = "व्यंजन (Consonants)";
      break;
    case "matras":
      currentData = matras;
      title = "मात्राएँ (Vowel Signs)";
      break;
    case "combo":
      currentData = generateCombinations();
      title = "व्यंजन + मात्रा संयोजन (Combinations)";
      break;
  }

  const subset = currentData.slice(
    start,
    Math.min(end + 1, currentData.length)
  );

  return (
    <div
      className=" bg-white border border-gray-200 rounded-xl p-6 shadow-2xl overflow-y-auto"
      style={{ maxHeight: ACTIVITY_HEIGHT + 548 }}
    >
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          📝 Original Text — {title}
        </h3>
        <div className="text-sm text-gray-500">
          Indices {start} —{" "}
          {Math.max(start, Math.min(end, currentData.length - 1))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {subset.length ? (
          subset.map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="flex items-center justify-center rounded-lg bg-gray-50 text-gray-800 font-semibold text-2xl h-14 shadow-sm"
            >
              {c}
            </div>
          ))
        ) : (
          <div className="col-span-4 text-base text-gray-600">
            No items in this range — adjust indices above.
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Main Page ----------
export default function HindiShufflePage() {
  const [listType, setListType] = useState<
    "swar" | "vyanjan" | "matras" | "combo"
  >("swar");
  const [items, setItems] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [vStart, setVStart] = useState(0);
  const [vEnd, setVEnd] = useState(Math.min(9, vyanjan.length - 1));
  const [cStart, setCStart] = useState(0);
  const [cEnd, setCEnd] = useState(
    Math.min(14, generateCombinations().length - 1)
  );
  const combosMemo = useMemo(() => generateCombinations(), []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartData, setChartData] = useState({
    title: "",
    range: "",
    items: [] as string[],
  });
  const [activityWidth, setActivityWidth] = useState(360); // fallback width for SSR

  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // ---------------- Effects ----------------

  useEffect(() => {
    if (!boxRef.current) return;

    const updateWidth = () => {
      setWidth(boxRef.current!.clientWidth); // or offsetWidth
    };

    console.log(updateWidth);

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const data = buildData();
    setItems(data);
    setTimeout(() => shufflePositions(data.length), 40);
    setShowAnswer(false);
  }, [listType, vStart, vEnd, cStart, cEnd, activityWidth]);

  useEffect(() => {
    const exitHandler = () =>
      !document.fullscreenElement && setIsFullscreen(false);
    document.addEventListener("fullscreenchange", exitHandler);
    return () => document.removeEventListener("fullscreenchange", exitHandler);
  }, []);

  useEffect(() => {
    setActivityWidth(width);
  }, [width]);

  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleExit);
    return () => document.removeEventListener("fullscreenchange", handleExit);
  }, []);

  // ---------------- Helpers ----------------
  const buildData = () => {
    switch (listType) {
      case "swar":
        return swar.slice();
      case "vyanjan":
        return vyanjan.slice(vStart, Math.min(vEnd + 1, vyanjan.length));
      case "matras":
        return matras.slice();
      case "combo":
        return combosMemo.slice(cStart, Math.min(cEnd + 1, combosMemo.length));
      default:
        return [];
    }
  };

  const getDynamicItemSize = () => {
    if (typeof window === "undefined") return ITEM_SIZE;
    if (!isFullscreen) return ITEM_SIZE;

    // fullscreen size = scale item based on viewport
    const vw = window.innerWidth;
    return Math.max(60, Math.min(140, vw * 0.06));
  };

  const calculateActivityWidth = () => {
    if (typeof window === "undefined") return 360;

    const vw =
      typeof window !== "undefined"
        ? Math.max(
            document.documentElement?.clientWidth || 0,
            window.innerWidth || 0
          )
        : 360;

    const maxWidth = 920;
    const width = Math.floor(vw * 0.9 * 0.6);
    console.log(document.querySelector(".suffled")?.clientWidth);

    console.log(vw, maxWidth, width);

    return width;
  };

  const shufflePositions = (length: number) => {
    const itemSize = getDynamicItemSize();
    const safe: { left: number; top: number }[] = [];
    const result: { top: string; left: string }[] = [];
    const maxAttempts = 600;

    for (let i = 0; i < length; i++) {
      let attempts = 0,
        placed = false,
        pos = { left: 0, top: 0 };
      while (!placed && attempts < maxAttempts) {
        const left =
          Math.random() * Math.max(0, activityWidth - itemSize - 28) + 12;
        const top =
          Math.random() * Math.max(0, ACTIVITY_HEIGHT - itemSize - 28) + 12;
        pos = { left, top };
        if (!safe.some((s) => hasCollision(pos, s))) {
          safe.push(pos);
          placed = true;
        }
        attempts++;
      }
      if (!placed) {
        const perRow = Math.max(
          1,
          Math.floor((activityWidth - 40) / (itemSize + 12))
        );
        const left = 20 + (i % perRow) * (itemSize + 12);
        const top = 20 + Math.floor(i / perRow) * (itemSize + 12);
        pos = { left, top };
        safe.push(pos);
      }
      result.push({ top: `${pos.top}px`, left: `${pos.left}px` });
    }
    setPositions(result);
  };

  const handleFullScreen = () => {
    const elem = document.querySelector(".suffled");
    if (!elem) return;

    if (!document.fullscreenElement) {
      // ENTER fullscreen
      elem.requestFullscreen();
      setIsFullscreen(true);
    } else {
      // EXIT fullscreen
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShowChart = () => {
    let data: any[] = [];
    let title = "";
    let startIndex = 0;
    let endIndex = 0;

    if (listType === "swar") {
      data = swar;
      title = "स्वर (Vowels)";
      startIndex = 0;
      endIndex = swar.length - 1;
    } else if (listType === "vyanjan") {
      data = vyanjan;
      title = "व्यंजन (Consonants)";
      startIndex = 0;
      endIndex = vyanjan.length - 1;
    } else if (listType === "matras") {
      data = matras;
      title = "मात्राएँ (Vowel Signs)";
      startIndex = 0;
      endIndex = matras.length - 1;
    } else if (listType === "combo") {
      data = combosMemo;
      title = "व्यंजन + मात्रा संयोजन (Combinations)";
      startIndex = 0;
      endIndex = combosMemo.length - 1;
    }

    setChartData({
      title,
      range: `${startIndex} → ${endIndex}`,
      items: data,
    });

    setShowChartModal(true);
  };

  const getItemStyle = (index: number) => {
    if (showAnswer) {
      const perRow = Math.floor((activityWidth - 48) / (ITEM_SIZE + 12)) || 6;
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      return {
        left: `${20 + col * (ITEM_SIZE + 12)}px`,
        top: `${20 + row * (ITEM_SIZE + 12)}px`,
        transition: "all 500ms cubic-bezier(0.2,0.9,0.25,1)",
      };
    }
    return {
      left: positions[index]?.left ?? "10px",
      top: positions[index]?.top ?? "10px",
      transition: "all 500ms cubic-bezier(0.2,0.9,0.25,1)",
    };
  };

  const setNumberInRange = (
    raw: string,
    setter: (n: number) => void,
    max: number
  ) => {
    const n = parseInt(raw || "0", 10);
    if (!isNaN(n)) setter(Math.max(0, Math.min(max, n)));
  };

  // ---------------- Render ----------------
  const maxVyanjanIndex = vyanjan.length - 1;
  const maxComboIndex = combosMemo.length - 1;

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-fit ">
        <header className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            🔀 Hindi Script Arranger
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Practice vowels, consonants, matras or focused combinations. Use
            controls to shuffle or arrange items.
          </p>
        </header>

        {/* Preferences */}
        <div className="bg-white p-5 rounded-2xl shadow-xl mb-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={listType}
              onChange={(e) => setListType(e.target.value as any)}
              className="p-2 border border-gray-300 rounded-md shadow-sm text-base"
            >
              <option value="swar">स्वर (Vowels)</option>
              <option value="vyanjan">व्यंजन (Consonants)</option>
              <option value="matras">मात्राएँ (Vowel Signs)</option>
              <option value="combo">
                व्यंजन + मात्रा संयोजन (Combinations)
              </option>
            </select>
          </div>

          {(listType === "vyanjan" || listType === "combo") && (
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                <label className="text-sm text-gray-600">Start</label>
                <input
                  type="number"
                  min={0}
                  className="w-20 p-1 border rounded text-center text-sm"
                  value={listType === "vyanjan" ? vStart : cStart}
                  onChange={(e) =>
                    listType === "vyanjan"
                      ? setNumberInRange(
                          e.target.value,
                          setVStart,
                          maxVyanjanIndex
                        )
                      : setNumberInRange(
                          e.target.value,
                          setCStart,
                          maxComboIndex
                        )
                  }
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                <label className="text-sm text-gray-600">End</label>
                <input
                  type="number"
                  min={0}
                  className="w-20 p-1 border rounded text-center text-sm"
                  value={listType === "vyanjan" ? vEnd : cEnd}
                  onChange={(e) =>
                    listType === "vyanjan"
                      ? setNumberInRange(
                          e.target.value,
                          setVEnd,
                          maxVyanjanIndex
                        )
                      : setNumberInRange(e.target.value, setCEnd, maxComboIndex)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Shuffle Area */}
          <div
            ref={boxRef}
            className={`
    suffled flex flex-col 
    bg-white rounded-xl shadow-lg border border-gray-200
    w-full 
    ${isFullscreen ? "fixed inset-0 z-[9999]" : ""}
  `}
            style={{
              height: isFullscreen ? "100vh" : "auto",
              minHeight: ACTIVITY_HEIGHT + 84,
              position: isFullscreen ? "fixed" : "relative",
            }}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Shuffled Activity Area
                </h2>
                <div className="text-sm text-gray-500">
                  Items: <span className="font-semibold">{items.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShowChart()}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
                >
                  Chart
                </button>
                <button
                  onClick={() => shufflePositions(items.length)}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow"
                >
                  🔄 Shuffle
                </button>
                <button
                  onClick={() => setShowAnswer((s) => !s)}
                  className={`px-4 py-2 rounded-lg text-white font-semibold shadow ${
                    showAnswer
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {showAnswer ? "Hide Order" : "💡 Arrange"}
                </button>
                <button
                  onClick={handleFullScreen}
                  className={`px-4 py-2 rounded-lg text-white font-semibold shadow
    ${
      isFullscreen
        ? "bg-gray-600 hover:bg-gray-700"
        : "bg-yellow-500 hover:bg-yellow-600"
    }
  `}
                >
                  {isFullscreen ? "❎ Exit Fullscreen" : "⛶ Full Screen"}
                </button>
              </div>
            </div>

            <div
              style={{
                height: isFullscreen ? "calc(100% - 84px)" : ACTIVITY_HEIGHT,
              }}
              className="relative p-4"
            >
              {items.map((char, index) => {
                const itemSize = getDynamicItemSize();
                return (
                  <div
                    key={`${char}-${index}`}
                    className="absolute flex items-center justify-center select-none rounded-lg shadow-lg cursor-pointer"
                    style={{
                      width: itemSize,
                      height: itemSize,
                      lineHeight: `${itemSize}px`,
                      borderRadius: 12,
                      boxSizing: "border-box",
                      ...getItemStyle(index),
                      zIndex: showAnswer ? 60 : 30,
                    }}
                    title={char}
                  >
                    <div
                      className={`w-full h-full flex items-center justify-center rounded-md border ${
                        showAnswer
                          ? "bg-red-50 text-red-700 border-red-200 hover:bg-gray-100 hover:text-gray-800 text-2xl font-bold"
                          : "bg-gray-100 text-gray-800 border-gray-300 font-bold hover:bg-red-100 text-2xl"
                      }`}
                      // style={{ fontSize: Math.floor(itemSize * 0.26) }}
                    >
                      {char}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reference Panel */}
          <OriginalTextReference
            listType={listType}
            start={listType === "vyanjan" ? vStart : cStart}
            end={listType === "vyanjan" ? vEnd : cEnd}
          />
        </div>
      </div>
      {showChartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-100">
              <h2 className="text-xl font-bold">{chartData.title}</h2>
              <button
                onClick={() => setShowChartModal(false)}
                className="text-lg font-semibold text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>

            {/* Range */}
            <div className="p-3 text-gray-600 border-b">
              <span className="font-medium">Range:</span> {chartData.range}
            </div>

            {/* Content Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-4 gap-4 text-center text-2xl">
              {chartData.items.map((item, index) => (
                <div
                  key={index}
                  className="relative p-3 bg-gray-50 rounded-xl shadow-sm border text-3xl flex items-center justify-center"
                >
                  {item}

                  {/* Index in bottom-right corner */}
                  <span className="absolute bottom-1 right-2 text-sm text-red-500">
                    {index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

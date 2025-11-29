"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type District =
  | "千代田区"
  | "中央区"
  | "港区"
  | "新宿区"
  | "文京区"
  | "台東区"
  | "墨田区"
  | "江東区"
  | "品川区"
  | "目黒区"
  | "大田区"
  | "世田谷区"
  | "渋谷区"
  | "中野区"
  | "杉並区"
  | "豊島区"
  | "北区"
  | "荒川区"
  | "板橋区"
  | "練馬区"
  | "足立区"
  | "葛飾区"
  | "江戸川区";

type RamenType =
  | "醤油"
  | "塩"
  | "味噌"
  | "つけ麺"
  | "二郎系"
  | "家系"
  | "油そば"
  | "鶏白湯";

type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export default function Home() {
  const [selectedDistricts, setSelectedDistricts] = useState<District[]>([]);
  const [selectedRamenTypes, setSelectedRamenTypes] = useState<RamenType[]>([]);
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const districts: District[] = [
    "千代田区",
    "中央区",
    "港区",
    "新宿区",
    "文京区",
    "台東区",
    "墨田区",
    "江東区",
    "品川区",
    "目黒区",
    "大田区",
    "世田谷区",
    "渋谷区",
    "中野区",
    "杉並区",
    "豊島区",
    "北区",
    "荒川区",
    "板橋区",
    "練馬区",
    "足立区",
    "葛飾区",
    "江戸川区",
  ];

  const ramenTypes: RamenType[] = [
    "醤油",
    "塩",
    "味噌",
    "つけ麺",
    "二郎系",
    "家系",
    "油そば",
    "鶏白湯",
  ];

  // 23区の選択ハンドラ
  // 既に選択されている場合は削除、されていなければ追加
  const handleDistrictChange = (district: District) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? // 削除処理（一致した区を除外した新たな配列を作成）
          prev.filter((d) => d !== district)
        : // 追加処理（末尾に新たな区を追加した新たな配列を格納）
          // ※stateは参照が変わらないと再レンダリングされないため、スプレッド構文で新たな配列を作成する必要がある
          [...prev, district]
    );
  };

  // ラーメン種類の選択ハンドラ（区と同様）
  const handleRamenTypeChange = (ramenType: RamenType) => {
    setSelectedRamenTypes((prev) =>
      prev.includes(ramenType)
        ? prev.filter((t) => t !== ramenType)
        : [...prev, ramenType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // 🔸送信時にエラーを初期化
    setResult("");

    // 場所が未選択の場合
    if (selectedDistricts.length === 0) {
      setError("場所を少なくとも1つ選択してください。");
      return;
    }

    // 最低金額が最高金額を上回っている場合
    if (minPrice > maxPrice) {
      setError("最低金額は最高金額以下に設定してください。");
      return;
    }

    // ラーメン種類が未選択の場合
    if (selectedRamenTypes.length === 0) {
      setError("ラーメンの種類を少なくとも1つ選択してください。");
      return;
    }

    setResult("AIが厳選中です…🍜");

    const payload = {
      districts: selectedDistricts,
      ramenTypes: selectedRamenTypes,
      minPrice,
      maxPrice,
    };

    // ▼ ここでバックエンドAPIにリクエスト送信予定
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      console.log("レスポンス", res);
      const data = await res.json();
      setResult(data.message);
    } catch (error) {
      console.error("APIリクエストエラー:", error);
      setError("APIリクエストに失敗しました。");
    }
  };

  // 型安全なcodeレンダラを使用
  const Code: React.FC<CodeProps> = ({
    inline,
    className,
    children,
    ...props
  }) => {
    if (inline) {
      return (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-gray-100 p-3 rounded overflow-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  };

  // react-markdown の期待型へキャスト（any は使わない）
  const markdownComponents: Components = {
    code: Code as unknown as Components["code"],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-100 flex flex-col items-center py-10 px-4">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-red-700 drop-shadow-md mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🍜 東京ラーメンレコ麺ド
      </motion.h1>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-xl rounded-2xl p-6 w-full max-w-2xl space-y-6 border border-amber-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* 場所 */}
        <section>
          <h2 className="text-lg font-bold text-amber-800 mb-2">
            📍 場所（複数選択可）
          </h2>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
            {districts.map((d) => (
              <label
                key={d}
                className={`flex items-center space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 transition ${
                  selectedDistricts.includes(d)
                    ? "bg-red-100 text-red-700 font-semibold"
                    : "hover:bg-amber-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(d)}
                  onChange={() => handleDistrictChange(d)}
                  className="accent-red-600"
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 価格帯 */}
        <section>
          <h2 className="text-lg font-bold text-amber-800 mb-2">
            💴 価格帯（円）
          </h2>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center">
              <label className="text-sm text-gray-600">最低金額：</label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="ml-2 border rounded-md px-2 py-1 focus:ring-2 focus:ring-amber-300"
              >
                {[500, 700, 900, 1100, 1300, 1500, 1700, 1900].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-sm text-gray-600">最高金額：</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="ml-2 border rounded-md px-2 py-1 focus:ring-2 focus:ring-amber-300"
              >
                {[800, 1000, 1200, 1400, 1600, 1800, 2000].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 種類 */}
        <section>
          <h2 className="text-lg font-bold text-amber-800 mb-2">
            🍥 ラーメンの種類
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ramenTypes.map((type) => (
              <label
                key={type}
                className={`flex items-center space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 transition ${
                  selectedRamenTypes.includes(type)
                    ? "bg-red-100 text-red-700 font-semibold"
                    : "hover:bg-amber-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRamenTypes.includes(type)}
                  onChange={() => handleRamenTypeChange(type)}
                  className="accent-red-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 🔸 エラーメッセージ表示 */}
        {error && (
          <motion.div
            className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-4 py-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* ボタン */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-red-500 to-amber-400 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:from-red-600 hover:to-amber-500 transition"
          type="submit"
        >
          🍜 レコメンドを聞く！
        </motion.button>
      </motion.form>

      {/* 結果表示 */}
      {result && (
        <motion.div
          className="relative mt-8 overflow-hidden rounded-2xl border bg-white/70 dark:bg-neutral-900/60 backdrop-blur shadow-xl ring-1 ring-black/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 上部アクセントライン */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400" />

          {/* アクションバー*/}
          <div className="flex items-center justify-between px-6 pt-4">
            <h3 className="text-sm font-medium text-neutral-500">
              AIからの結果
            </h3>
          </div>

          <div className="p-6">
            <div
              className="prose prose-amber prose-lg max-w-6xl leading-relaxed text-left
                      prose-headings:scroll-mt-20 prose-headings:font-semibold
                      prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:underline hover:prose-a:no-underline
                      prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-transparent prose-pre:shadow-none
                      prose-ol:marker:text-amber-500 prose-ul:marker:text-amber-500
                      dark:prose-invert [&_td]:px-4 [&_th]:px-4 [&_td]:py-2 [&_th]:py-2 [&_table]:w-full [&_table]:table-fixed
                      [&_a]:text-blue-600 [&_a]:underline
                      [&_a:hover]:text-blue-800 [&_a:hover]:no-underline"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}

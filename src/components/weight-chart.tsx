import { View } from 'react-native';
import { G, Line, Path, Svg, Text as SvgText } from 'react-native-svg';

import type { WeightEntry } from '@/lib/types';

type WeightChartProps = {
  entries: WeightEntry[];
  targetWeight: number | null;
  yMin: number;
  yMax: number;
  testID?: string;
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 180;
const PADDING = { top: 16, right: 16, bottom: 32, left: 44 };

const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

function toX(dateMs: number, minMs: number, rangeMs: number): number {
  if (rangeMs === 0) return PADDING.left + plotWidth / 2;
  return PADDING.left + ((dateMs - minMs) / rangeMs) * plotWidth;
}

function toY(weight: number, yMin: number, yMax: number): number {
  const range = yMax - yMin;
  if (range === 0) return PADDING.top + plotHeight / 2;
  return PADDING.top + (1 - (weight - yMin) / range) * plotHeight;
}

export function WeightChart({ entries, targetWeight, yMin, yMax, testID }: WeightChartProps) {
  if (entries.length === 0) return null;

  const dateMsValues = entries.map((e) => new Date(e.entryDate).getTime());
  const minMs = Math.min(...dateMsValues);
  const maxMs = Math.max(...dateMsValues);
  const rangeMs = maxMs - minMs;

  const points = entries.map((entry, index) => ({
    x: toX(dateMsValues[index]!, minMs, rangeMs),
    y: toY(entry.weight, yMin, yMax),
    entry,
  }));

  const pathD =
    points.length === 1
      ? `M ${points[0]!.x} ${points[0]!.y}`
      : points.map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(' ');

  const targetY = targetWeight !== null ? toY(targetWeight, yMin, yMax) : null;

  const yTicks = [yMin, Math.round((yMin + yMax) / 2), yMax];

  const xLabels = entries
    .filter((_, i) => i === 0 || i === entries.length - 1)
    .map((entry, i) => {
      const index = i === 0 ? 0 : entries.length - 1;
      const x = toX(dateMsValues[index]!, minMs, rangeMs);
      const label = entry.entryDate.slice(5);
      return { x, label };
    });

  return (
    <View>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} testID={testID}>
        <G>
          {yTicks.map((tick) => {
            const y = toY(tick, yMin, yMax);
            return (
              <G key={tick}>
                <Line
                  x1={PADDING.left}
                  y1={y}
                  x2={PADDING.left + plotWidth}
                  y2={y}
                  stroke="#D9E1DD"
                  strokeWidth={1}
                />
                <SvgText
                  x={PADDING.left - 6}
                  y={y + 4}
                  fontSize={10}
                  fill="#51605A"
                  textAnchor="end"
                >
                  {tick}
                </SvgText>
              </G>
            );
          })}

          {targetY !== null && (
            <Line
              x1={PADDING.left}
              y1={targetY}
              x2={PADDING.left + plotWidth}
              y2={targetY}
              stroke="#006C48"
              strokeWidth={1.5}
              strokeDasharray="4,3"
              testID="weight-chart-target-line"
            />
          )}

          <Path d={pathD} stroke="#00D18E" strokeWidth={2.5} fill="none" />

          {points.map(({ x, entry }) => (
            <G key={entry.id}>
              <Line
                x1={x}
                y1={PADDING.top}
                x2={x}
                y2={PADDING.top + plotHeight}
                stroke="#D9E1DD"
                strokeWidth={1}
                strokeDasharray="2,4"
              />
            </G>
          ))}

          {xLabels.map(({ x, label }) => (
            <SvgText
              key={label}
              x={x}
              y={CHART_HEIGHT - 6}
              fontSize={10}
              fill="#51605A"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ))}
        </G>
      </Svg>
    </View>
  );
}

// export default function FaqStylePanel({ cfg, onChange, customFonts }) {

//   const up = (k, v) => onChange({ ...cfg, [k]: v });
//   return (
//     <div style={{ padding: "12px 14px" }}>
//       <SHead title="Container" />
//       <ColorRow
//         label="Background"
//         val={cfg.bgColor}
//         onChange={(v) => up("bgColor", v)}
//       />
//       <ColorRow
//         label="Border color"
//         val={cfg.borderColor}
//         onChange={(v) => up("borderColor", v)}
//       />
//       <Slider
//         label="Border width"
//         min={0}
//         max={6}
//         val={cfg.borderWidth}
//         unit="px"
//         onChange={(v) => up("borderWidth", v)}
//       />
//       <Slider
//         label="Border radius"
//         min={0}
//         max={40}
//         val={cfg.borderRadius}
//         unit="px"
//         onChange={(v) => up("borderRadius", v)}
//       />
//       <Slider
//         label="Padding"
//         min={8}
//         max={60}
//         val={cfg.padding}
//         unit="px"
//         onChange={(v) => up("padding", v)}
//       />
//       <Slider
//         label="Gap"
//         min={0}
//         max={40}
//         val={cfg.gap}
//         unit="px"
//         onChange={(v) => up("gap", v)}
//       />
//       <Slider
//         label="Max width"
//         min={300}
//         max={1400}
//         step={10}
//         val={cfg.maxWidth}
//         unit="px"
//         onChange={(v) => up("maxWidth", v)}
//       />
//       <SHead title="Question" />
//       <ColorRow
//         label="Color"
//         val={cfg.qColor}
//         onChange={(v) => up("qColor", v)}
//       />
//       <Slider
//         label="Font size"
//         min={12}
//         max={32}
//         val={cfg.qSize}
//         unit="px"
//         onChange={(v) => up("qSize", v)}
//       />
//       <FontSelect
//         label="Font family"
//         val={cfg.qFont}
//         onChange={(v) => up("qFont", v)}
//         customFonts={customFonts}
//       />
//       <SelectRow
//         label="Font weight"
//         val={cfg.qWeight}
//         options={WEIGHTS}
//         onChange={(v) => up("qWeight", v)}
//       />
//       <SelectRow
//         label="Alignment"
//         val={cfg.qAlign}
//         options={ALIGNS}
//         onChange={(v) => up("qAlign", v)}
//       />
//       <SHead title="Answer" />
//       <ColorRow
//         label="Color"
//         val={cfg.aColor}
//         onChange={(v) => up("aColor", v)}
//       />
//       <Slider
//         label="Font size"
//         min={11}
//         max={28}
//         val={cfg.aSize}
//         unit="px"
//         onChange={(v) => up("aSize", v)}
//       />
//       <FontSelect
//         label="Font family"
//         val={cfg.aFont}
//         onChange={(v) => up("aFont", v)}
//         customFonts={customFonts}
//       />
//       <SelectRow
//         label="Font weight"
//         val={cfg.aWeight}
//         options={WEIGHTS}
//         onChange={(v) => up("aWeight", v)}
//       />
//       <SelectRow
//         label="Alignment"
//         val={cfg.aAlign}
//         options={ALIGNS}
//         onChange={(v) => up("aAlign", v)}
//       />
//       <SHead title="Active / Open state" />
//       <ColorRow
//         label="Active bg"
//         val={cfg.activeBg}
//         onChange={(v) => up("activeBg", v)}
//       />
//       <ColorRow
//         label="Active question color"
//         val={cfg.activeQColor}
//         onChange={(v) => up("activeQColor", v)}
//       />
//       <ColorRow
//         label="Icon color"
//         val={cfg.iconColor}
//         onChange={(v) => up("iconColor", v)}
//       />
//       <Slider
//         label="Icon size"
//         min={12}
//         max={36}
//         val={cfg.iconSize}
//         unit="px"
//         onChange={(v) => up("iconSize", v)}
//       />
//       <ColorRow
//         label="Divider color"
//         val={cfg.dividerColor}
//         onChange={(v) => up("dividerColor", v)}
//       />
//     </div>
//   );
// }

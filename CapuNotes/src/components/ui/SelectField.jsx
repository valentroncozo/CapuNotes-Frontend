import "../../styles/theme.css";

export default function SelectField({
  label, name, value="", onChange,
  options=[], required=false, error="", helper="", className=""
}){
  return (
    <label className={`block w-full ${className}`}>
      <span className="mb-1 block text-sm" style={{color:"var(--muted)"}}>
        {label}{required && <span style={{color:"var(--accent)"}}> *</span>}
      </span>
      <select
        className="w-full px-3 py-2 rounded-[12px] border"
        style={{
          background:"var(--card-color)",
          color:"var(--ink)",
          borderColor: error ? "var(--danger)" : "var(--line)"
        }}
        name={name}
        value={value}
        onChange={(e)=>onChange?.(e.target.value)}
      >
        <option value="" disabled>Seleccionar...</option>
        {options.map(opt=>(
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error ? (
        <small style={{color:"var(--danger)"}}>{error}</small>
      ) : helper ? (
        <small style={{color:"var(--muted)"}}>{helper}</small>
      ) : null}
    </label>
  );
}

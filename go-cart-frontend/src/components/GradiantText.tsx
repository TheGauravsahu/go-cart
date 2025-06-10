interface GradiantTextProps {
  text: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}

function GradiantText({ text, size }: GradiantTextProps) {
  return (
    <span
      className={`font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent text-${size}`}
    >
      {" "}
      {text}
    </span>
  );
}

export default GradiantText;

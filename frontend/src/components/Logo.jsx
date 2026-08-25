export default function Logo({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,10 45,10 45,55 30,55" fill="#8b7cf6" />
      <polygon points="20,40 55,40 55,55 20,55" fill="#8b7cf6" />
      <polygon points="20,40 35,40 55,90 40,90" fill="#38bdf8" />
      <polygon points="55,10 70,10 70,90 55,90" fill="#38bdf8" />
    </svg>
  );
}

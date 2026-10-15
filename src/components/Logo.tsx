/* eslint-disable @next/next/no-img-element */
/** Logo officiel de la CMCI, dans une pastille blanche pour rester lisible sur le bandeau bleu. */
export default function Logo({ size = 40, plain = false }: { size?: number; plain?: boolean }) {
  return (
    <img
      src={plain ? "/logo-cmci.png" : "/logo-badge.png"}
      alt="CMCI"
      width={size}
      height={size}
      className="flex-none select-none"
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}

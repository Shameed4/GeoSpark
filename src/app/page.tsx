import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <nav>
        <Link href="/map">Map</Link>
        <Link href="/other">Other</Link>
        <Link href="/report">Report</Link>
      </nav>
    </div>
  );
}

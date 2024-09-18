import { getTips } from "@/lib/actions";
import TipsCarousal from "./tips-carousal";
import { BACKUP_TIPS } from "@/lib/constants";

export default async function TipsSection() {
  const tips = await getTips();
  return (
    <section className="bg-secondary min-h-60 h-full grid rounded-lg place-content-center dark:bg-transparent">
      <TipsCarousal tips={tips.length ? tips : BACKUP_TIPS} />
    </section>
  );
}

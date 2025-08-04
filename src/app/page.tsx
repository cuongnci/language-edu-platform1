import Header from "@/components/Header";
import MainTable from "@/components/MainTable";

export default function Home() {
  return (
    <>
      <div className="h-full min-h-screen w-full">
        <Header />
        <div className="px-16 py-14">
          <div className="flex flex-col gap-4">
            <div className="text-darkblue font-bold text-2xl">Manager&#39;s Dashboard</div>
            <div className="text-base">Monitor student progress and engagement across your assigned course</div>
          </div>
          <MainTable />
        </div>
      </div>
    </>
  );
}

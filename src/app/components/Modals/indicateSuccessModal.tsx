import Image from "next/image";
import React from "react";

export default function IndicateSuccessModal({
  open,
  setOpen,
  setState,
  title,
  disc,
  header,
}: {
  open: any;
  setOpen: any;
  setState: any;
  disc: string;
  title: string;
  header: string;
}) {
  return (
    <>
      <div className="flex pl-[24px] pt-[24px] pr-[15px] justify-between w-[450px] items-center">
        <h2 className="text-[24px] font-bold text-[#333333]">{header}</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
        >
          ✕
        </button>
      </div>
      <div className="p-[24px] mt-[100px]">
        <div className="w-full justify-center items-center flex">
          <div className="w-full flex flex-col items-center">
            <Image
              src={"/Image/tick-circle.svg"}
              alt={"cred"}
              height={73}
              width={73}
              className="mb-[24px]"
            />
            <p className="text-[16px] font-bold text-[#333333] mb-[24px] text-center">
              {title}
            </p>
            <p className="text-[14px] font-medium text-[#8A8B9F] mb-[24px] text-center">
              {disc}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-[44px]">
          <button
            onClick={() => setOpen(false)}
            className="px-[81px] py-[10px] border border-[#333333] rounded-[4px] text-[12px] font-bold text-[#333333]"
          >
            Cancel
          </button>
          <button
            className="px-[81px] py-[10px] border border-[#156064] bg-[#156064] rounded-[4px] text-[12px] font-bold text-white"
            onClick={() => setOpen(false)}
          >
            {"Done"}
          </button>
        </div>
      </div>
    </>
  );
}

import { IoIosAlert } from "react-icons/io";

function InfoBanner({ string }: { string: string }) {
  return (
    <div>
      <div className="bg-blue-200 p-6 mb-15 flex justify-between mt-10 ">
        <p> {string} </p>
        <p>
          <IoIosAlert size={28} />
        </p>
      </div>
    </div>
  );
}

export default InfoBanner;

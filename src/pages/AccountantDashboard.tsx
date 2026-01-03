import { GetUsers } from "../api/users";
import { IoIosAlert } from "react-icons/io";
import AccountantHourReview from "../components/accountant/AccountantReview";
export default function AccountantPage() {
  const { data: users = [] } = GetUsers(); // Fetch all users

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold mb-8">Regnskap</h1>
      <div className="bg-blue-200 p-6 mb-15 flex justify-between">
        <p>Her finner du litt mer informasjon hvis du trenger.</p>
        <p>
          <IoIosAlert size={28} />
        </p>
      </div>

      <AccountantHourReview users={users} />
    </div>
  );
}

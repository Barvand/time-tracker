import { GetUsers } from "../api/users";
import AccountantHourReview from "../components/accountant/AccountantReview";
import AttentionMessage from "../components/UI/UX-messages/AttentionMessage";
export default function AccountantPage() {
  const { data: users = [] } = GetUsers(); // Fetch all users

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold mb-8">Regnskap</h1>
      <AttentionMessage
        message={`Her finner du informasjon om arbeidstimer.`}
      />
      <AccountantHourReview users={users} />
    </div>
  );
}

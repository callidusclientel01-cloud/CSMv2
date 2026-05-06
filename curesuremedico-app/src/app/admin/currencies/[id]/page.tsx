import CurrencyForm from "../CurrencyForm";

export default function EditCurrencyPage({ params }: { params: { id: string } }) {
  return <CurrencyForm currencyId={params.id} />;
}

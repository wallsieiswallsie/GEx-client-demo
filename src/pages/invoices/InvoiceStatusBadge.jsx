const statusClass = {
    unpaid: "bg-amber-50 text-amber-700 border-amber-100",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    canceled: "bg-red-50 text-red-700 border-red-100",
    not_received: "bg-gray-50 text-gray-600 border-gray-100",
    received: "bg-blue-50 text-blue-700 border-blue-100",
};

export default function InvoiceStatusBadge({ value }) {
    return (
        <span className={`px-2 py-1 rounded-full border text-[10px] font-semibold ${statusClass[value] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
            {value || "-"}
        </span>
    );
}

export default {
    async fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === "/invoices") {
            const invoices = await fetch(new URL("../public/invoices.json", import.meta.url)).then((r) => r.json());
            return new Response(JSON.stringify({ invoices }), {
                headers: { "Content-Type": "application/json" },
            });
        }
        if (url.pathname === "/payments") {
            const payments = await fetch(new URL("../public/payments.json", import.meta.url)).then((r) => r.json());
            return new Response(JSON.stringify({ payments }), {
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response("Not Found", { status: 404 });
    },
};

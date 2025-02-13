import { query } from "@/libs/db";

export async function GET(request) {
    const company = await query({
        query: "SELECT c.id AS company_id, c.name, u.email FROM company AS c JOIN users AS u ON c.emails LIKE CONCAT('%', u.email, '%') WHERE c.emails IS NOT NULL;",
        values: [],
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let data = JSON.stringify(company);
    
    return new Response(data, {
        status: 200,
        headers: headers,
    });
}
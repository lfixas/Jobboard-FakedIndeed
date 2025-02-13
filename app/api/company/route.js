import { query } from "@/libs/db";

export async function GET(request) {
    const company = await query({
        query: "SELECT * FROM company",
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

export async function POST(request) {
    try {
        const requestData = await request.json();
        const { name, emails } = requestData;

        const queryValues = [];
        const insertColumns = [];

        if (name) {
            queryValues.push(name);
            insertColumns.push('name');
        }

        // Split the emails string into an array
        let emailArray = [];
        if (emails) {
            emailArray = emails.split(',').map((email) => email.trim());
            queryValues.push(JSON.stringify(emailArray));
            insertColumns.push('emails');
        }

        if (insertColumns.length === 0) {
            return new Response(JSON.stringify({
                message: "No valid data provided",
                status: 400,
            }));
        }

        const insertQuery = `
            INSERT INTO company
            (${insertColumns.join(', ')})
            VALUES (${insertColumns.map(() => '?').join(', ')})
        `;

        const updateCompany = await query({
            query: insertQuery,
            values: queryValues,
        });

        const result = updateCompany.affectedRows;
        let message = "";

        if (result) {
            message = "success";
        } else {
            message = "error";
        }

        const product = {
            name,
            emails: emailArray, // Return the email array
        };

        return new Response(JSON.stringify({
            message: message,
            status: 200,
            product: product
        }));
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            data: request
        }));
    }
}

export async function PUT(request) {

    try {
        const requestData = await request.json();

        const { id, ...updateData } = requestData;

        if (id === undefined) {
            return new Response(JSON.stringify({
                message: "ID is required for updating",
                status: 400,
            }));
        }

        if (Object.keys(updateData).length === 0) {
            return new Response(JSON.stringify({
                message: "No valid update data provided",
                status: 400,
            }));
        }

        const setColumns = Object.keys(updateData);
        const updateValues = Object.values(updateData);

        const updateQuery = `
            UPDATE company
            SET ${setColumns.map(column => `${column} = ?`).join(', ')}
            WHERE id = ?
        `;
        
        const updateProducts = await query({
            query: updateQuery,
            values: [...updateValues, id],
        });

        const result = updateProducts.affectedRows;
        let message = "";

        if (result) {
            message = "success";
        } else {
            message = "error";
        }

        const product = {
            id,
            ...updateData,
        };
        
        return new Response(JSON.stringify({
            message: message,
            status: 200,
            product: product
        }));
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            data: request
        }));
    }

}


export async function DELETE(request) {

    try {
        const { id } = await request.json();
        const deleteCompany = await query({
            query: "DELETE FROM company WHERE id = ?",
            values: [id],
        });
        const result = deleteCompany.affectedRows;
        let message = "";
        if (result) {
            message = "success";
        } else {
            message = "error";
        }
        const product = {
            id: id,
        };
        return new Response(JSON.stringify({
            message: message,
            status: 200,
            product: product
        }));
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            data: res
        }));
    }

}
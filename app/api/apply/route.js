import { query } from "@/libs/db";

export async function GET(request) {
    const apply = await query({
        query: "SELECT * FROM apply",
        values: [],
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let data = JSON.stringify(apply);
    
    return new Response(data, {
        status: 200,
        headers: headers,
    });
}

export async function POST(request) {

    try {
        const requestData = await request.json();

        const {
            ad_id,
            company_name,
            name,
            lastname,
            email,
            phone,
            motivations,
            website,
            cv
        } = requestData;

        const queryValues = [];
        const insertColumns = [];

        if (ad_id) {
            queryValues.push(ad_id);
            insertColumns.push('ad_id');
        }


        if (company_name) {
            queryValues.push(company_name);
            insertColumns.push('company_name');
        }

        if (name) {
            queryValues.push(name);
            insertColumns.push('name');
        }

        if (lastname !== undefined) {
            queryValues.push(lastname);
            insertColumns.push('lastname');
        }
        
        if (email !== undefined) {
            queryValues.push(email);
            insertColumns.push('email');
        }

        if (phone !== undefined) {
            queryValues.push(phone);
            insertColumns.push('phone');
        }

        if (motivations !== undefined) {
            queryValues.push(motivations);
            insertColumns.push('motivations');
        }

        if (website !== undefined) {
            queryValues.push(website);
            insertColumns.push('website');
        }

        if (cv !== undefined) {
            queryValues.push(cv);
            insertColumns.push('cv');
        }

        if (insertColumns.length === 0) {
            return new Response(JSON.stringify({
                message: "No valid data provided",
                status: 400,
            }));
        }

        const insertQuery = `
            INSERT INTO apply
            (${insertColumns.join(', ')})
            VALUES (${insertColumns.map(() => '?').join(', ')})
        `;

        const updateApply = await query({
            query: insertQuery,
            values: queryValues,
        });

        const result = updateApply.affectedRows;
        let message = "";

        if (result) {
            message = "success";
        } else {
            message = "error";
        }

        const product = {
            ad_id,
            company_name,
            name,
            lastname,
            email,
            phone,
            motivations,
            website,
            cv
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
            UPDATE apply
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
        const deleteApply = await query({
            query: "DELETE FROM apply WHERE id = ?",
            values: [id],
        });
        const result = deleteApply.affectedRows;
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
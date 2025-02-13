import { query } from "@/libs/db";

export async function GET(request) {
    const users = await query({
        query: "SELECT * FROM users",
        values: [],
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let data = JSON.stringify(users);
    
    return new Response(data, {
        status: 200,
        headers: headers,
    });
}

export async function POST(request) {

    try {
        const requestData = await request.json();

        const {
            email,
            password,
            userType,
            name,
            lastname,
            phone,
            website
        } = requestData;

        const queryValues = [];
        const insertColumns = [];

        if (email) {
            queryValues.push(email);
            insertColumns.push('email');
        }

        if (password) {
            queryValues.push(password);
            insertColumns.push('password');
        }

        if (userType !== undefined) {
            queryValues.push(userType);
            insertColumns.push('userType');
        }
        
        if (name !== undefined) {
            queryValues.push(name);
            insertColumns.push('name');
        }

        if (lastname !== undefined) {
            queryValues.push(lastname);
            insertColumns.push('lastname');
        }

        if (phone !== undefined) {
            queryValues.push(phone);
            insertColumns.push('phone');
        }

        if (website !== undefined) {
            queryValues.push(website);
            insertColumns.push('website');
        }

        if (insertColumns.length === 0) {
            return new Response(JSON.stringify({
                message: "No valid data provided",
                status: 400,
            }));
        }

        const insertQuery = `
            INSERT INTO users
            (${insertColumns.join(', ')})
            VALUES (${insertColumns.map(() => '?').join(', ')})
        `;

        const updateUsers = await query({
            query: insertQuery,
            values: queryValues,
        });

        const result = updateUsers.affectedRows;
        let message = "";

        if (result) {
            message = "success";
        } else {
            message = "error";
        }

        const product = {
            email,
            password,
            userType
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
            UPDATE users
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
        const deleteUser = await query({
            query: "DELETE FROM users WHERE id = ?",
            values: [id],
        });
        const result = deleteUser.affectedRows;
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
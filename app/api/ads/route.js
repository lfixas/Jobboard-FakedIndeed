import { query } from "@/libs/db";

export async function GET(request) {
    const ads = await query({
        query: "SELECT * FROM ads",
        values: [],
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    let data = JSON.stringify(ads);
    
    return new Response(data, {
        status: 200,
        headers: headers,
    });
}

export async function POST(request) {

    try {
        const requestData = await request.json();

        const {
            title,
            description,
            jobTypes,
            minSalary,
            maxSalary,
            advantages,
            company,
            location,
            positionLocation
        } = requestData;

        // const queryValues = [
        //     title,
        //     description,
        //     JSON.stringify(jobTypes),
        //     minSalary,
        //     maxSalary,
        //     advantages,
        //     company,
        //     location,
        //     positionLocation
        // ];

        // const insertQuery = `
        //     INSERT INTO ads
        //     (title, description, jobTypes, minSalary, maxSalary, advantages, company, location, positionLocation)
        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        // `;

        const queryValues = [];
        const insertColumns = [];

        if (title) {
            queryValues.push(title);
            insertColumns.push('title');
        }

        if (description) {
            queryValues.push(description);
            insertColumns.push('description');
        }

        if (jobTypes) {
            queryValues.push(JSON.stringify(jobTypes));
            insertColumns.push('jobTypes');
        }

        if (minSalary !== undefined) {
            queryValues.push(minSalary);
            insertColumns.push('minSalary');
        }

        if (maxSalary !== undefined) {
            queryValues.push(maxSalary);
            insertColumns.push('maxSalary');
        }

        if (advantages !== undefined) {
            queryValues.push(advantages);
            insertColumns.push('advantages');
        }

        if (company !== undefined) {
            queryValues.push(company);
            insertColumns.push('company');
        }

        if (location !== undefined) {
            queryValues.push(location);
            insertColumns.push('location');
        }

        if (positionLocation !== undefined) {
            queryValues.push(positionLocation);
            insertColumns.push('positionLocation');
        }

        if (insertColumns.length === 0) {
            return new Response(JSON.stringify({
                message: "No valid data provided",
                status: 400,
            }));
        }

        const insertQuery = `
            INSERT INTO ads
            (${insertColumns.join(', ')})
            VALUES (${insertColumns.map(() => '?').join(', ')})
        `;

        const updateAds = await query({
            query: insertQuery,
            values: queryValues,
        });

        const result = updateAds.affectedRows;
        let message = "";

        if (result) {
            message = "success";
        } else {
            message = "error";
        }

        const product = {
            title,
            description,
            jobTypes,
            minSalary,
            maxSalary,
            advantages,
            company,
            location,
            positionLocation
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
            UPDATE ads
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
        const deleteAd = await query({
            query: "DELETE FROM ads WHERE id = ?",
            values: [id],
        });
        const result = deleteAd.affectedRows;
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
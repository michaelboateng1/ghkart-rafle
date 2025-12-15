export function GET({ cookies }) {
    try {
        const cookie = cookies.get('ghkart.prizeWinner');
        if (!cookie) {
            return new Response(JSON.stringify({ found: false }), { status: 404 });
        }

        let parsed;
        try {
            parsed = JSON.parse(cookie);
        } catch (e) {
            // If cookie is double-encoded or wrapped, try to unwrap
            try {
                parsed = JSON.parse(JSON.parse(cookie));
            } catch (err) {
                parsed = cookie;
            }
        }

        return new Response(JSON.stringify({ found: true, winner: parsed }), { status: 200 });
    } catch (err) {
        console.error('winner-info error', err);
        return new Response(JSON.stringify({ found: false }), { status: 500 });
    }
}

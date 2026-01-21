import {NextRequest} from "next/server";

export function forwardAuth(req: NextRequest) {
    const auth = req.headers.get("authorization");
    return auth ? { Authorization: auth } : {};
}

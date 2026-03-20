import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/controllers/userController";

// GET /api/users
export async function GET(req) {
  const result = await getUsers(req);

  return NextResponse.json(result.data, {
    status: result.status
  });
}

// POST /api/users
export async function POST(req) {
  const result = await createUser(req);

  return NextResponse.json(result.data, {
    status: result.status
  });
}
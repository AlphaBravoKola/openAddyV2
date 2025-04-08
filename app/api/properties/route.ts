import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const properties = await prisma.property.findMany({
      where: {
        managerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, address, instructions } = await req.json()

    if (!name || !address || !instructions) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const property = await prisma.property.create({
      data: {
        name,
        address,
        instructions,
        managerId: session.user.id,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 
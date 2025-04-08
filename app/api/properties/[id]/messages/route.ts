import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }

    // Only allow access if user is the manager or a driver
    if (property.managerId !== session.user.id && session.user.role !== "DRIVER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        propertyId: params.id,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }

    // Only allow access if user is the manager or a driver
    if (property.managerId !== session.user.id && session.user.role !== "DRIVER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { content } = await req.json()

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Message content is required" },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        propertyId: params.id,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 
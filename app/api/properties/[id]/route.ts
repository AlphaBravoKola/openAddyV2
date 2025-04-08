import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

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
      include: {
        manager: {
          select: {
            name: true,
            email: true,
          },
        },
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

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MANAGER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, address, instructions } = await req.json()

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

    if (property.managerId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const updatedProperty = await prisma.property.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        address,
        instructions,
      },
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MANAGER") {
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

    if (property.managerId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.property.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 
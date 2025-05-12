import { NextResponse } from "next/server"

// This is a proxy API route that forwards requests to your Python Lambda backend
// Replace the LAMBDA_API_URL with your actual Lambda API endpoint

const LAMBDA_API_URL = process.env.LAMBDA_API_URL || "https://your-lambda-api-url.amazonaws.com"

export async function GET() {
  try {
    // Sample data for demonstration - replace with actual API call
    const data = [
      {
        id: "001",
        phase: "pending",
        message: "Need to update documentation",
        jiraIssueId: "JIRA-1234",
        createdAt: "2023-05-12T00:00:00.000Z",
      },
      {
        id: "002",
        phase: "completed",
        message: "Fixed login issue",
        jiraIssueId: "JIRA-1235",
        createdAt: "2023-05-11T00:00:00.000Z",
      },
      {
        id: "003",
        phase: "in-progress",
        message: "Implementing new feature",
        jiraIssueId: "JIRA-1236",
        createdAt: "2023-05-10T00:00:00.000Z",
      },
    ]

    // In production, you would fetch from your Lambda API:
    // const response = await fetch(`${LAMBDA_API_URL}/replies`);
    // const data = await response.json();

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching replies:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In production, you would forward to your Lambda API:
    // const response = await fetch(`${LAMBDA_API_URL}/replies`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    // const data = await response.json();

    // Mock response for demonstration
    const newReply = {
      id: Math.random().toString(36).substring(2, 8),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newReply)
  } catch (error) {
    console.error("Error creating reply:", error)
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
  }
}

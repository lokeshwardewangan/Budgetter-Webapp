import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as aiService from './ai.service.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, threadId = nanoid(), stream = false } = req.body;
  const userId = req.userId as string;

  if (!message) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Message is required'));
    return;
  }

  if (stream) {
    // Set headers for Server-Sent Events (SSE)
    res.writeHead(StatusCodes.OK, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx
    });

    try {
      const eventStream = aiService.streamAgentEvents(userId, threadId, message);

      for await (const event of eventStream) {
        if (event.event === 'on_chat_model_stream' && event.data?.chunk?.content) {
          const text = event.data.chunk.content;
          res.write(`data: ${JSON.stringify({ type: 'token', text })}\n\n`);
        } else if (event.event === 'on_tool_start') {
          res.write(
            `data: ${JSON.stringify({
              type: 'tool_start',
              tool: event.name,
              input: event.data?.input,
            })}\n\n`,
          );
        } else if (event.event === 'on_tool_end') {
          res.write(
            `data: ${JSON.stringify({
              type: 'tool_end',
              tool: event.name,
              output: event.data?.output,
            })}\n\n`,
          );
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message || err })}\n\n`);
      res.end();
    }
  } else {
    const result = await aiService.askAgent(userId, threadId, message);
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          { threadId, ...result },
          'AI Assistant response generated successfully',
        ),
      );
  }
});

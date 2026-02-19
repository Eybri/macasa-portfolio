import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #050505; color: #ffffff; }
                    .container { max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; background-color: #0a0a0a; }
                    .header { background-color: #E10600; padding: 20px; text-align: left; }
                    .header h1 { margin: 0; font-size: 18px; letter-spacing: 5px; color: #ffffff; text-transform: uppercase; }
                    .status-bar { background-color: #111; padding: 10px 20px; border-bottom: 1px solid #1a1a1a; font-size: 10px; color: #666; letter-spacing: 2px; }
                    .content { padding: 40px 30px; }
                    .section { margin-bottom: 30px; }
                    .label { color: #E10600; font-size: 10px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
                    .value { font-size: 14px; color: #eee; line-height: 1.6; }
                    .message-box { background-color: #050505; border-left: 3px solid #E10600; padding: 20px; font-style: italic; }
                    .footer { padding: 20px; border-top: 1px solid #1a1a1a; text-align: center; font-size: 9px; color: #333; letter-spacing: 2px; }
                    .tech-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #E10600; margin-right: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Transmission Received</h1>
                    </div>
                    <div class="status-bar">
                        <span class="tech-indicator"></span> STATUS: SECURE_LINK_ACTIVE // SECTOR: CONTACT_INTERFACE
                    </div>
                    <div class="content">
                        <div class="section">
                            <div class="label">// SOURCE_IDENTIFIER</div>
                            <div class="value"><strong>Name:</strong> ${name}</div>
                            <div class="value"><strong>Email:</strong> ${email}</div>
                        </div>
                        
                        <div class="section">
                            <div class="label">// TRANSMISSION_HEADER</div>
                            <div class="value">${subject}</div>
                        </div>
                        
                        <div class="section">
                            <div class="label">// PAYLOAD_DATA</div>
                            <div class="message-box">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div class="section" style="margin-bottom: 0;">
                            <div class="label">// SYSTEM_METADATA</div>
                            <div class="value" style="font-size: 10px; color: #444;">
                                TIMESTAMP: ${new Date().toISOString()}<br>
                                PROTOCOL: HTTPS/RESEND_API_V3<br>
                                ENCRYPTION: TLS_1.3
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        PORTFOLIO://MACASA.AVERY // SYSTEM_LEVEL_A1
                    </div>
                </div>
            </body>
            </html>
        `;

        const data = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: ['averymikasa@gmail.com'],
            subject: `[PORTFOLIO_COMMS] ${subject}`,
            replyTo: email,
            html: htmlContent,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Transmission failure:', error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

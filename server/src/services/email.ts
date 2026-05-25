import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

const GEM_ICON_BASE64 = `iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAE6UlEQVR4nOyaTWwbRRiGv5m6jSO1qiJXSEQRdbjEByQ4FFWitgoSsQgSuVXcot5TSloJ0
d58AbUHEOop6sENHMjPpRJcyIlFVRrT2BCkBgFFSRo1zg9xTLDX9trrHWbihNjOendmdh3hyo+08cY7Mzvver5559tdDM85GJ5z2gJbnbbAVqctsNXxgMtcvvy
9N/zGK+fRcR2J1CMlD/kjmf0xEuktgIu4KpCJK6vafYJKfZjgXqHKWF/yAvx55w557+pVpIFLuDZE98UhBO+oaj4JghR1g9ZB/bnt5W+pyA5wCVcEVotj/6+t7
4AouVx5b89dkY4F1otjbGz+0w2C5PKkqo57Ih0JNBPHyGbzZw1CUrztsLJaiZyt/dYdkdICG4mrgHBRKy0DJ4ZBlrFpX5yLlBJoLa7CdlrNAidawbAo60yksEA
ecYyNzZ2TwIlaMGzKyosUEsgrjrG1lfUTAoZdOVamkCd+sEVOJLdAEXGMUkn3GYbx1LYgIU9pDPqAC3GRXAJFxe3DY/gVgxdBTKStQFlxDB7DPzB4EfhFWgp0I
o7BY/i1Bi8Cn8iGAp2KY9gZvrnBi2Av0lSgG+L2OmBp+I0NXugcliJN06XV5cVhOsF30t0fwCF/pXypYDBgauQLj9Op5GqKe0FgwQmUTF+hn5/VHzAVmFvbumu
c6nifZqyvg0NW1zemu3yvXjQ7lkqr09lM/iI4hHrpHMrDXbNjpsNj5vePM2XsGaBVF8AhPyWWuuiHWQKrPXmy3QUOIXQglIvHB6LfBDNmxxuO/0ePrqRQ2ROmT
SyCA6jh99FOxOBwx2JG0egDBxDaNzrKwl/dP99wIrMM8JmfP0gWgfTTloQz9H0QQqdVtXBIoJbXY/TgaZAniTD0RyeCln2zncHi8euLJd0I0yvOnd8dbmNppf6
7X39Lr4AkrC9lBOHo1yHb0cU1Rc/9cn0B6cBiMgMSTE3NFKE2DrUHykoRZCCQIQQNfDke5JofuD3o4fzIHE0NBukZdBCkkNd6quOQ7dMh2gOiEKIbiAyOTV6Y4
60iZLKx+DWFdm6IEGKbBtX2C/z0j1L1BW0H+UEMuvCBobGJkCJSSXgVMRu/Nk4ADwtVAhQAjJWDs7J9EgAxhu9NhcZBEKllUizx4Si9mjf5a5CAx+uZhUocamw
fEeAXSMhNOluOggTS68DZxMgtGky3ecoyq7h06YtOFnts++Sj+U5+iyC3o5OhWyCJo4Xuw8TIDfpLcl3ZDnwssBuHbOtQeX+90ehE6AY4wPGN39nE38N00rGND
QTlShzSDSNkK5CuUsZfClwQjPXDuHDrPmJ0nNoZokNPsSqFMfi9Jz0xttEJ0W9VlrW1tK4PRSJIaLY2PS+4gKJEdJzRBmnHGvoTs4reXlRgm5VF7GYGORhUlLe
E/dYM154u2Wcg1cPS3CLsMgMZXH3Ca52BHIgyswiezEAGoaewvJw79/nLJwh+QFuvuaGU00nXa/43AXvVdF2VJGAS4lk8i9KUZ/SNMpBdq6izCJHMQIamvYRgl
oEwq6ixCMHMQIamvmVRn4Ewq/jPIiQyAxma/hpJdQbCrGLPIqQyAxmOwRHwLDn9uKf73U06o719xvfiGQTo03uToTE4Ao5EIOPZ2nfxnu4Bzwu+7nnZzECGptj
E/4n2u2qtTltgq9MW2Or8CwAA//+nxhX8AAAABklEQVQDAAYJxjQgzItAAAAAAElFTkSuQmCC`;

const gemIconAttachment = {
    filename: "gem-icon.png",
    content: Buffer.from(GEM_ICON_BASE64, "base64"),
    cid: "gem-icon@lucid",
};

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0c0d17;font-family:-apple-system,BlinkMacSystemFont,'Segoe
UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 16px;">

<!-- Brand header -->
<div style="text-align:center;margin-bottom:32px;">
<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
    <tr>
    <td style="vertical-align:middle;padding-right:8px;line-height:0;">
        <img src="cid:gem-icon@lucid" width="28" height="28" alt="" style="display:block;" />
    </td>
    <td style="vertical-align:middle;">
        <span style="font-size:22px;font-weight:800;letter-spacing:0.16em;color:#7f77dd;line-height:1;">LUCID</span>
    </td>
    </tr>
</table>
</div>

<!-- Card -->
<div style="background-color:#1e1f30;border-radius:12px;padding:40px 36px;border:1px solid rgba(127,119,221,0.2);">
${content}
</div>

<!-- Footer -->
<p style="text-align:center;color:#6b6890;font-size:12px;margin-top:24px;line-height:1.6;">
If you did not request this email you can safely ignore it.<br/>
&copy; ${new Date().getFullYear()} Lucid
</p>

</div>
</body>
</html>
`;

const actionButton = (href: string, label: string) => `
<a href="${href}" style="display:inline-block;margin-top:28px;padding:14px 28px;background-color:#7f77dd;color:#ffffff;t
ext-decoration:none;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
    ${label}
</a>
`;

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
    await transporter.sendMail({
        from: config.EMAIL_USER,
        to,
        subject: "Reset your Lucid password",
        attachments: [gemIconAttachment],
        text: [
            "Reset your Lucid password",
            "",
            "We received a request to reset your password.",
            "Click the link below to choose a new one:",
            "",
            resetUrl,
            "",
            "This link expires in 1 hour.",
            "If you did not request this, you can safely ignore this email.",
        ].join("\n"),
        html: emailWrapper(`
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f0eefa;">
                Reset your password
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#9b98b8;line-height:1.6;">
                We received a request to reset the password for your Lucid account.
                Click the button below to choose a new one.
            </p>
            <p style="margin:0;font-size:13px;color:#6b6890;">
                This link expires in <strong style="color:#f0eefa;">1 hour</strong>.
            </p>
            ${actionButton(resetUrl, "Reset password")}
        `),
    });
};

export const sendEmailVerificationEmail = async (to: string, verifyUrl: string) => {
    await transporter.sendMail({
        from: config.EMAIL_USER,
        to,
        subject: "Verify your Lucid email",
        attachments: [gemIconAttachment],
        text: [
            "Verify your Lucid email",
            "",
            "Thanks for signing up. Verify your email address to get started:",
            "",
            verifyUrl,
            "",
            "If you did not create a Lucid account, you can safely ignore this email.",
        ].join("\n"),
        html: emailWrapper(`
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f0eefa;">
                Verify your email
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#9b98b8;line-height:1.6;">
                Thanks for signing up to Lucid. Click the button below to verify
                your email address and activate your account.
            </p>
            ${actionButton(verifyUrl, "Verify email")}
        `),
    });
};

"use client";
import Link from "next/link";

export default function LetterWithEffects({ text = "P", href = "/", className = "" }) {
	return (
		<Link
			href={href}
			className={`glitch-letter ${className}`}
			data-text={text}
			aria-label={`Open ${text}`}
		>
			{text}
		</Link>
	);
}

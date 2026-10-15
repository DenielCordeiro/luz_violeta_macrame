export interface About {
	_id: string;
	company: Section;
	businesswoman: Section;
}

interface Section {
	title: string;
	paragraph: Paragraph[];
}

export interface Paragraph {
	_id: number;
	phrases: string;
}
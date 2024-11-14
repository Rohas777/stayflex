export interface IMail {
    slug: string;
    name: string;
    subject: string;
    description: string;
    constructions: {
        name: string;
        construction: string;
        description: string;
    }[];
}

export interface Project {
  id: number;
  name: string;
  teamName: string;
  logoPath: string;
}

export type GetMyProjectsResponse = Project[];

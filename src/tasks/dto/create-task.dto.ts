export type WordData = {
  id: number;
  alias: string;
  title: string;
  transcription: string;
  description: string;
  prem_description: string;
  is_phrase: boolean;
  is_active: boolean;
  level_id: number;
  topic_id: number;
  language_id: number;
};

export class CreateTaskDto {
  readonly user_id: number;
  readonly status: number;
  readonly words: WordData[];
}

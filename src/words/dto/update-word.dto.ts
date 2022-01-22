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

export class UpdateWordDto {
  readonly alias: string;
  readonly title: string;
  readonly transcription: string;
  readonly description: string;
  readonly prem_description: string;
  readonly is_phrase: boolean;
  readonly is_active: boolean;
  readonly level_id: number;
  readonly topic_id: number;
  readonly language_id: number;
  readonly translations: string;
}

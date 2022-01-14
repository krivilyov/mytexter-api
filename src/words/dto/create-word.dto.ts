export class CreateWordDto {
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

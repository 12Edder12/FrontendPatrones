// types/ITemplate.ts
export interface ITemplateDetail {
    id_detail?: number;
    field: string;
    typeField: string;
    operation: string;
    statusActive: boolean;
  }
  
  export interface ITemplate {
    id_template?: number;
    name: string;
    queryId: number;
    query: {
      name: string;
      type_bd: string;
    };
    statusActive: boolean;
    templateDetails: ITemplateDetail[];
  }
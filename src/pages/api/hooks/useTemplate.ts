// hooks/useTemplates.ts
import { useState, useEffect } from 'react';
import { ITemplate, ITemplateDetail } from '../types/ITemplate';
import Cookies from 'js-cookie';

export function useTemplates() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:3000/templates`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setTemplates(jsonResponse as ITemplate[]);
      }
    } catch (error) {
      console.error('Failed to fetch templates', error);
    }
    setLoading(false);
  };

  const createTemplate = async (template: Partial<ITemplate>) => {
    const token = Cookies.get('token');
    console.log('template', template);
    try {
      await fetch(`http://localhost:3000/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(template),
      });
      fetchTemplates(); 
    } catch (error) {
      console.error('Failed to create template', error);
    }
  };

  const deleteTemplate = async (id: number) => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      fetchTemplates(); // Refresh the templates list
    } catch (error) {
      console.error('Failed to delete template', error);
    }
  };

  const updateTemplate = async (template: Partial<ITemplate>) => {
      const token = Cookies.get('token');
      const { id_template, ...templateData } = template; // Exclude id_template
      
      console.log('template', templateData);
    try {
      await fetch(`http://localhost:3000/templates/${id_template}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(templateData),
      });
      fetchTemplates(); // Refresh the templates list
    } catch (error) {
      console.error('Failed to update template', error);
    }
  };

  const addFieldToTemplate = async (templateId: number, details: Partial<ITemplateDetail>[]) => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/template-detail/${templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateDetails: details }),
      });
      fetchTemplates(); // Refresh the templates list
    } catch (error) {
      console.error('Failed to add field to template', error);
    }
  };

  const deleteTemplateDetails = async (detailIds: number[]) => {
    const token = Cookies.get('token');
    try {
      await fetch(`http://localhost:3000/template-detail`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_details: detailIds }),
      });
      fetchTemplates(); // Refresh the templates list
    } catch (error) {
      console.error('Failed to delete template details', error);
    }
  };

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate,
    addFieldToTemplate,
    deleteTemplateDetails,
  };
}
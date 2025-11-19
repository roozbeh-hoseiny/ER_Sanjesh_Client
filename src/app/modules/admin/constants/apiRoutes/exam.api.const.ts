export const adminExamsApiRoutes = (baseUrl: string) => {
  const examsBaseUrl = `${baseUrl}/exam`;
  return {
    activate: () => `${examsBaseUrl}/ActivateExam`,
    deactivate: () => `${examsBaseUrl}/DeactiveExam`,

    getAll: () => `${examsBaseUrl}/GetAll`,
    byEducationalLevel: () => `${examsBaseUrl}/GetByEducationalLevel`,
    byField: () => `${examsBaseUrl}/GetByFieldOfStudy`,
    byLesson: () => `${examsBaseUrl}/GetByLesson`,
    byStatus: () => `${examsBaseUrl}/GetByStatus`,
    byTitle: () => `${examsBaseUrl}/GetByTitle`,
    single: () => `${examsBaseUrl}/GetOne`,

    create: () => `${examsBaseUrl}/AddExam`,
    edit: () => `${examsBaseUrl}/EditExam`,
    start: () => `${examsBaseUrl}/SetStatusToStart`,
    end: () => `${examsBaseUrl}/SetStatusToEnd`,
    startRegistration: () => `${examsBaseUrl}/SetStatusToStartRegistration`,
    endRegistration: () => `${examsBaseUrl}/SetStatusToEndRegistration`,

    addQuestion: () => `${examsBaseUrl}/AddQuestion`,
    editQuestion: () => `${examsBaseUrl}/EditQuestion`,
  };
};

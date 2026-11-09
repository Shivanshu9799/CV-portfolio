import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
  }, 'Not a real calendar date');

const strArr = z.array(z.string());

export const projectSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().optional(),
    title: z.string().optional(), // per-project title override
    name: z.string().min(1),
    road_ids: strArr.optional(),
    chainage: strArr.optional(),
    length_km: z.number().positive().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    contract_mode: z.string().optional(),
    structure_types: strArr.optional(),
    authority_division: z.string().optional(),
    client: z.string().optional(),
    stated_project_value_text: z.string().optional(),
    stated_value_cr: z.number().positive().optional(),
  })
  .strict();

export const employmentSchema = z
  .object({
    id: z.string().min(1),
    confirmed_in_original_cv: z.boolean(),
    employer: z.string().min(1),
    employer_location: z.string().optional(),
    start: isoDate,
    end: isoDate.nullable(),
    is_current: z.boolean(),
    title: z.string().min(1),
    location: z.string().optional(),
    client: z.string().optional(),
    concessionaire: z.string().optional(),
    epc_contractor: z.string().optional(),
    contractors: z.string().optional(),
    main_contractors: strArr.optional(),
    stated_project_value_text: z.string().optional(),
    stated_value_cr: z.number().positive().optional(),
    stated_value_cr_combined: z.number().positive().optional(),
    projects: z.array(projectSchema).min(1),
    responsibilities_verbatim: strArr.min(1),
  })
  .strict()
  .refine((e) => (e.end === null ? e.is_current : true), 'Open-ended role must be current')
  .refine((e) => e.end === null || e.end >= e.start, 'End date before start date');

// ---- Executive slots (all empty today; render only with verified data) ----
export const caseStudySchema = z
  .object({
    project_id: z.string().min(1),
    context: z.string().min(1),
    scope_and_contract_mode: z.string().min(1),
    role: z.string().min(1),
    challenges: strArr.min(1),
    actions: strArr.min(1),
    outcomes: z
      .array(z.object({ metric: z.string(), baseline: z.string(), result: z.string() }).strict())
      .min(1),
    reference_available: z.boolean(),
  })
  .strict();

export const slotsSchema = z
  .object({
    leadership_scope: z
      .object({
        peak_team_size: z.number().nullable(),
        direct_reports: z.number().nullable(),
        subcontractors_managed: z.number().nullable(),
        monthly_billing_cr: z.number().nullable(),
        sites_handled_concurrently: z.number().nullable(),
      })
      .strict(),
    quantified_results: z
      .array(
        z
          .object({
            project_id: z.string(),
            metric: z.string(),
            baseline: z.string(),
            result: z.string(),
            confirmer: z.string(),
          })
          .strict(),
      )
      .default([]),
    case_studies: z.array(caseStudySchema).default([]),
    awards: z
      .array(z.object({ title: z.string(), issuer: z.string().optional(), year: z.number().optional() }).strict())
      .default([]),
    recommendations: z
      .array(z.object({ name: z.string(), role: z.string(), quote: z.string() }).strict())
      .default([]),
    availability: z
      .object({
        notice_period: z.string().nullable(),
        relocation: z.string().nullable(),
        open_to_international: z.boolean().nullable(),
      })
      .strict(),
    software_and_tools: strArr.default([]),
    additional_certifications: z
      .array(z.object({ title: z.string(), issuer: z.string(), year: z.number().nullable() }).strict())
      .default([]),
  })
  .strict();

export const contentSchema = z
  .object({
    version: z.number(),
    identity: z
      .object({
        full_name: z.string(),
        base_location: z.string(),
        career_start: isoDate,
        headline_default: z.string(),
        headline_alternatives: strArr,
      })
      .strict(),
    education: z.array(
      z
        .object({
          id: z.string(),
          qualification: z.string(),
          institution: z.string(),
          year: z.number().int().nullable().optional(),
          mode_of_study: z.string().nullable().optional(),
        })
        .strict(),
    ),
    certifications: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          issuer: z.string(),
          issuer_as_written_in_cv: z.string().optional(),
          year: z.number().int().nullable(),
          certificate_number: z.string().nullable(),
        })
        .strict(),
    ),
    title_progression: z
      .object({
        steps: z.array(
          z
            .object({
              title: z.string(),
              period: z.string(),
              employers: strArr,
              confirmed: z.boolean().optional(),
            })
            .strict(),
        ),
      })
      .strict(),
    employment: z.array(employmentSchema).min(1),
    executive_positioning: z
      .object({
        open_to: strArr,
        executive_summary_draft: z.string(),
        core_competencies_grouped: z.record(strArr),
        derived_numbers_compute_at_build: z
          .object({
            cumulative_stated_contract_value_cr_original_cv: z.number(),
            employers_original_cv: z.number(),
            employers_with_ekam: z.number(),
            employment_entries_original_cv: z.number(),
            states_worked: strArr,
            clients: strArr,
            states_unconfirmed: strArr.default([]),
            clients_unconfirmed: strArr.default([]),
          })
          .strict(),
      })
      .strict(),
    executive_slots_empty_until_candidate_supplies: slotsSchema,
  })
  .strict();

export const contactSchema = z
  .object({
    phones: z
      .array(z.object({ number: z.string(), in_original_cv: z.boolean(), note: z.string().optional() }).strict())
      .default([]),
    emails: strArr.default([]),
  })
  .passthrough();

export type Content = z.infer<typeof contentSchema>;
export type Employment = z.infer<typeof employmentSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Slots = z.infer<typeof slotsSchema>;
export type Contact = z.infer<typeof contactSchema>;

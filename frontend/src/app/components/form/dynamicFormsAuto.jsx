import RenderField from "./renderField";

export default function DynamicFormsAuto({ infos, ignorFields, register, control, errors, tables }) {

    // Split fields into columns based on Column Break and Section Break
    const columns = infos.fields.reduce((acc, info) => {
        if (info.fieldtype == "HTML" || info.fieldtype == "Tab Break" || ignorFields.includes(info.fieldname)) return acc;

        if (info.fieldtype === 'Section Break') {
            acc.push({
                isSection: true,
                label: info.label,
                description: info.description,
                fields: [[]]
            });
        } else if (info.fieldtype === 'Column Break') {
            if (acc.length === 0) {
                acc.push({
                    isSection: true,
                    fields: [[]]
                });
            }
            const currentSection = acc[acc.length - 1];
            currentSection.fields.push([]);
        } else {
            if (acc.length === 0) {
                acc.push({
                    isSection: true,
                    fields: [[]]
                });
            }
            const currentSection = acc[acc.length - 1];
            const currentColumn = currentSection.fields[currentSection.fields.length - 1];
            currentColumn.push(info);
        }
        return acc;
    }, []);

    return (
        <div className="w-full space-y-2">
            {columns.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                    {section.label && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{section.label}</h3>
                            {section.description && (
                                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                            )}
                        </div>
                    )}
                    {section.fields.some(column => column.length > 0) && (
                        <div className="flex flex-col md:flex-row flex-wrap gap-4 border-[0.1px] border-gray-200 rounded-lg">
                            {section.fields.map((column, columnIndex) => <div key={columnIndex} className={`flex-1 min-w-[250px] px-4 md:y-4 sm:y-2`}>
                                {column.map((item, itemIndex) => <RenderField key={itemIndex} item={item} control={control} register={register} errors={errors} tables={tables} />)}
                            </div>)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
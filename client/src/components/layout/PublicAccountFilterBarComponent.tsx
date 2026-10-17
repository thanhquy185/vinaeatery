type PublicAccountFilterOption = {
  key: string;
  label: string;
  count?: number;
};

type PublicAccountFilterBarComponentProps = {
  value: string;
  options: PublicAccountFilterOption[];
  onChange: (value: string) => void;
};

const PublicAccountFilterBarComponent: React.FC<
  PublicAccountFilterBarComponentProps
> = ({ value, options, onChange }) => (
  <div
    role="group"
    aria-label="Lọc danh sách"
    className="public-account-filter"
  >
    {options.map(({ key, label, count }) => {
      const isActive = value === key;

      return (
        <button
          key={key}
          type="button"
          aria-pressed={isActive}
          onClick={() => onChange(key)}
          className={`public-account-filter__item ${
            isActive
              ? "is-active"
              : ""
          }`}
        >
          {label}
          {count !== undefined && (
            <span
              className="public-account-filter__count"
            >
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default PublicAccountFilterBarComponent;

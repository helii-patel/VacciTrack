import { vaccineInfoCategories } from "@/lib/vaccination-data";
import { Link } from "wouter";

export function VaccineInformation() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Vaccine Information</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5">
          <p className="text-slate-700 mb-4">
            Vaccines are one of the most effective ways to protect your child from potentially serious diseases.
            Learn more about recommended vaccines based on your child's age.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {vaccineInfoCategories.map((category, index) => (
              <Link key={index} href="/vaccine-info">
                <a className="group block p-4 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5">
                  <div className="font-medium text-slate-900 group-hover:text-primary mb-1">{category.title}</div>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </a>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/vaccine-info">
              <a className="text-primary hover:text-primary-dark text-sm font-medium">
                Full Vaccine Schedule →
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

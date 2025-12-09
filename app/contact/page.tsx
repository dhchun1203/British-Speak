"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // 클라이언트 사이드에서 Supabase 직접 호출
      const { data, error: supabaseError } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject,
            message: formData.message,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message || "문의사항 전송에 실패했습니다.");
      }

              setSubmitStatus({
                type: "success",
                message: t.contact.success,
              });
              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
              });
            } catch (error: any) {
              setSubmitStatus({
                type: "error",
                message: error.message || t.contact.error,
              });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t.contact.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* 문의 폼 */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
                {t.contact.form}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t.contact.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t.contact.namePlaceholder}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t.contact.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t.contact.emailPlaceholder}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t.contact.phone}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t.contact.subject} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t.contact.subjectPlaceholder}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t.contact.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder={t.contact.messagePlaceholder}
                    required
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-md ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.contact.submitting : t.contact.submit}
                </button>
              </form>
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
                  {t.contact.contactInfo}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {t.contact.phoneInquiry}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700">
                      {t.contact.phoneNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {t.contact.phoneHours}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {t.contact.emailInquiry}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 break-all">
                      {t.contact.emailAddress}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {t.contact.emailHours}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t.contact.visit}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 mb-2">
                      {t.contact.visitText}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {t.contact.visitNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* 운영 시간 */}
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
                  {t.contact.hours}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-700">
                      {t.contact.weekday}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-800">
                      {t.contact.weekdayHours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-700">
                      {t.contact.saturday}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-800">
                      {t.contact.saturdayHours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-700">
                      {t.contact.sunday}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-red-600">
                      {t.contact.closed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


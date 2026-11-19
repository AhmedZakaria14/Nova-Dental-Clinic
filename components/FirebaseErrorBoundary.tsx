'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  isQuotaError: boolean;
}

export default class FirebaseErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      isQuotaError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const msg = error?.message || 'Unexpected error';
    const isQuotaError = msg.toLowerCase().includes('quota exceeded');
    return {
      hasError: true,
      errorMessage: msg,
      isQuotaError,
    };
  }

  componentDidCatch(error: Error) {
    console.error('FirebaseErrorBoundary caught error:', error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
      isQuotaError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-xl rounded-[28px] border border-[#D4AF37]/30 bg-[#141310] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-950/40 text-amber-300">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#F7F3E9]">
            {this.state.isQuotaError
              ? 'تم تجاوز الحد اليومي لقاعدة البيانات'
              : 'تعذر إتمام الاتصال بقاعدة البيانات'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
            {this.state.isQuotaError
              ? 'تم الوصول إلى الحد اليومي المجاني لقراءات Firestore. يُعاد ضبط الحصة تلقائياً في اليوم التالي.'
              : 'حدث خطأ أثناء الاتصال بالخادم أو التحقق من الصلاحيات. يمكنك المحاولة مجدداً أو التواصل مع العيادة على 01031235562.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>إعادة المحاولة / Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

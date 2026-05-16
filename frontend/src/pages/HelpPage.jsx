import React from 'react';

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I create a new task?",
      answer: "To create a new task, navigate to the 'My Tasks' or 'Dashboard' page and click on the 'Add task' or 'Create New Task' button. Fill in the required details like Title, Project, Assignee, Priority, and Due Date."
    },
    {
      question: "What are 'Vital Tasks'?",
      answer: "Vital Tasks are high-priority tasks that require immediate attention. You can view them by clicking the 'Vital Tasks' tab in the sidebar, which automatically filters your task list to show only tasks marked with 'High' priority."
    },
    {
      question: "How do I update my profile picture?",
      answer: "Go to the 'Settings' page from the sidebar. Under your profile information, you can click on your current avatar to upload a new profile picture. Don't forget to save your changes!"
    },
    {
      question: "Can I delete a project if I am not an admin?",
      answer: "No, project deletion is restricted to Workspace Administrators. If you need a project removed, please contact an Admin."
    }
  ];

  return (
    <div className="animate-fade-in relative w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2">
            Help Center
          </h1>
          <p className="text-textMuted text-base md:text-lg">Find answers to common questions and learn how to use Ethara.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: FAQs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-bgCard rounded-3xl p-6 md:p-8 border border-borderC gradient-border-hover flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary mb-6 border-b border-borderC pb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="stagger-item group bg-white/5 border border-borderC rounded-2xl p-5 gradient-border-hover" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{faq.question}</h4>
                  <p className="text-sm text-textMuted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Support */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <div className="bg-bgCard rounded-3xl p-6 md:p-8 border border-borderC gradient-border-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
            
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary mb-6 relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Need more help?
            </h3>

            <p className="text-sm text-textMuted mb-6 relative z-10">
              Can't find the answer you're looking for? Our support team is here to help you get the most out of Ethara.
            </p>

            <form className="flex flex-col gap-4 relative z-10" onSubmit={(e) => { e.preventDefault(); alert('Message sent to support team!'); }}>
              <div>
                <label className="block text-xs font-bold text-textMuted uppercase tracking-wide mb-1">Subject</label>
                <input type="text" className="input bg-white/5 focus:bg-bgCard" placeholder="What is this regarding?" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-textMuted uppercase tracking-wide mb-1">Message</label>
                <textarea className="input bg-white/5 focus:bg-bgCard resize-none h-32" placeholder="Describe your issue in detail..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2 py-3 shadow-md">Send Message</button>
            </form>
          </div>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20 flex items-center gap-4">
             <div className="w-12 h-12 bg-bgCard rounded-xl shadow-soft flex items-center justify-center flex-shrink-0 text-primary">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
             </div>
             <div>
               <h4 className="font-bold text-white text-sm mb-1">Documentation</h4>
               <a href="#" className="text-xs text-primary font-semibold hover:underline">Read the full guide &rarr;</a>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;

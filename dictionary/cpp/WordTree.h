#pragma once

#include <vector>
#include <string>
#include <map>
#include <random>

#include "Node.h"

struct Word{
	std::wstring str;
	double weight;
	Word(const std::wstring & str) : str(str), weight(0.0) {}
};

class WordTree{
public:
	void add(const std::wstring & word);
	bool exist(const std::wstring & word) const;
	void clear();
	void calcStats();
	std::wstring getWordByLength(size_t length, double start, double end) const;
private:
	static size_t levenshtein_distance(const std::wstring &s1, const std::wstring &s2);
private:
	Node root;
	std::vector<Word> words;
	std::map<size_t, std::vector<Word> > wordsByLength;
};